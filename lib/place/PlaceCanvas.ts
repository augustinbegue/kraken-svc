import type { Tile } from "@prisma/client";
import { writable, type Writable } from "svelte/store";

export class PlaceCanvas {
    // Constants
    static TILE_SIZE = 16;
    static CANVAS_SIZE = 255;
    static COOLDOWN = 1000 * 60 * 1; // 1 minute
    static CANVAS_PALETTE = [
        "#6d001a",
        "#be0039",
        "#ff4500",
        "#ffa800",
        "#ffd635",
        "#fff8b8",
        "#00a368",
        "#00cc78",
        "#7eed56",
        "#00756f",
        "#009eaa",
        "#00ccc0",
        "#2450a4",
        "#3690ea",
        "#51e9f4",
        "#493ac1",
        "#6a5cff",
        "#94b3ff",
        "#811e9f",
        "#b44ac0",
        "#e4abff",
        "#de107f",
        "#ff3881",
        "#ff99aa",
        "#6d482f",
        "#9c6926",
        "#ffb470",
        "#000000",
        "#515252",
        "#898d90",
        "#d4d7d9",
        "#ffffff",
    ];
    private MIN_SCALE = 0.3;
    private INTERACTION_SCALE = 0.5;

    public board: Tile[];
    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
    public cursor: HTMLElement;

    public zoomFactor = this.MIN_SCALE;
    public xTranslate: number;
    public yTranslate: number;

    public interactionEnabled: Writable<boolean> = writable(false);

    constructor(
        canvas: HTMLCanvasElement,
        cursor: HTMLElement,
        board: Tile[],
        embed = false,
    ) {
        this.canvas = canvas;
        let ctx = canvas.getContext("2d");
        if (ctx === null) {
            throw new Error("Could not get canvas context");
        }
        this.ctx = ctx;
        this.cursor = cursor;

        // Initialize board
        this.board = board;

        // Initialize canvas size and translation
        this.xTranslate =
            window.innerWidth / 2 -
            (PlaceCanvas.CANVAS_SIZE * PlaceCanvas.TILE_SIZE) / 2;
        this.yTranslate =
            window.innerHeight / 2 -
            (PlaceCanvas.CANVAS_SIZE * PlaceCanvas.TILE_SIZE) / 2;
        this.ctx.canvas.width = PlaceCanvas.CANVAS_SIZE * PlaceCanvas.TILE_SIZE;
        this.ctx.canvas.height =
            PlaceCanvas.CANVAS_SIZE * PlaceCanvas.TILE_SIZE;
        this.ctx.imageSmoothingEnabled = false;

        if (!embed) {
            // Add event listeners
            this.canvas.addEventListener(
                "mousedown",
                this.handleMouseDown.bind(this),
            );
            this.canvas.addEventListener(
                "mouseup",
                this.handleMouseUp.bind(this),
            );
            this.canvas.addEventListener(
                "mousemove",
                this.handleMouseMove.bind(this),
            );
            this.canvas.addEventListener(
                "wheel",
                this.handleMouseWheel.bind(this),
            );
            this.canvas.addEventListener(
                "mouseleave",
                this.handleMouseLeave.bind(this),
            );
            window.addEventListener("resize", this.handleResize.bind(this));

            // Set initial cursor position
            let { x, y } = this.getCanvasCoordsFromScreenCoords(
                window.innerWidth / 2,
                window.innerHeight / 2,
            );
            this.moveCursor(x, y);

            // Start animation loop
            this.animate();
        }

        // Draw initial board
        this.drawBoard();
    }

    /*
     * Event Functions.
     */
    onTileClick = (event: MouseEvent, x: number, y: number) => {};
    onMove = (event: MouseEvent, dragging: boolean) => {};

    /*
     * Canvas Event Handlers.
     */
    private dragging = false;
    private moved = false;
    handleMouseDown(e: MouseEvent) {
        this.dragging = true;
        this.moved = false;
    }
    handleMouseUp(e: MouseEvent) {
        if (this.moved && this.dragging) {
            this.moved = false;
            this.dragging = false;
            if (this.zoomFactor >= this.INTERACTION_SCALE) {
                this.boundCanvas();
                this.showSelectedTile();
            } else {
                this.clearCursor();
            }
        } else {
            let { x, y } = this.getCanvasCoordsFromScreenCoords(
                e.clientX,
                e.clientY,
            );
            this.onTileClick(e, x, y);
            this.dragging = false;
            this.moved = false;
        }
    }
    handleMouseMove(e: MouseEvent) {
        this.moved = true;
        if (this.dragging) {
            this.xTranslate += e.movementX;
            this.yTranslate += e.movementY;
        }
        this.onMove(e, this.dragging);
    }
    handleMouseWheel(e: WheelEvent) {
        if (e.deltaY < 0) {
            this.zoomFactor *= 1.1;
        } else {
            this.zoomFactor /= 1.1;
        }

        this.zoomFactor = Math.max(this.MIN_SCALE, this.zoomFactor);

        if (this.zoomFactor >= this.INTERACTION_SCALE) {
            this.boundCanvas();
            this.showSelectedTile();
        } else {
            this.clearCursor();
        }
    }
    handleMouseLeave(e: MouseEvent) {
        this.dragging = false;
    }
    handleResize(e: UIEvent) {
        this.xTranslate =
            window.innerWidth / 2 -
            (PlaceCanvas.CANVAS_SIZE * PlaceCanvas.TILE_SIZE) / 2;
        this.yTranslate =
            window.innerHeight / 2 -
            (PlaceCanvas.CANVAS_SIZE * PlaceCanvas.TILE_SIZE) / 2;
    }

    /*
     * Canvas Rendering Functions.
     */
    /**
     * Bounds the canvas to the screen
     */
    boundCanvas() {
        let canvasBounds = this.canvas.getBoundingClientRect();
        let cursorBounds = this.cursor.getBoundingClientRect();

        if (cursorBounds.left < canvasBounds.left) {
            this.xTranslate -= canvasBounds.left - cursorBounds.left;
        }
        if (cursorBounds.right > canvasBounds.right) {
            this.xTranslate += cursorBounds.right - canvasBounds.right;
        }
        if (cursorBounds.top < canvasBounds.top) {
            this.yTranslate -= canvasBounds.top - cursorBounds.top;
        }
        if (cursorBounds.bottom > canvasBounds.bottom) {
            this.yTranslate += cursorBounds.bottom - canvasBounds.bottom;
        }
    }

    /*
     * Canvas Utility Functions.
     */
    /**
     * Returns coordinates relative to the canvas from the screen coordinates
     * @param x
     * @param y
     */
    getCanvasCoordsFromScreenCoords(x: number, y: number) {
        let bounds = this.canvas.getBoundingClientRect();

        x -= bounds.left;
        y -= bounds.top;

        x /= bounds.width;
        y /= bounds.height;

        x *= PlaceCanvas.CANVAS_SIZE;
        y *= PlaceCanvas.CANVAS_SIZE;

        return {
            x: Math.floor(x),
            y: Math.floor(y),
        };
    }
    /**
     * Returns the canvas coordinates from the index of the board array
     * @param i
     */
    getCanvasCoordsFromIndex(i: number) {
        return {
            x: i % PlaceCanvas.CANVAS_SIZE,
            y: Math.floor(i / PlaceCanvas.CANVAS_SIZE),
        };
    }
    /**
     * Returns the index of the board array from the canvas coordinates
     * @param x
     * @param y
     */
    getIndexFromCanvasCoords(x: number, y: number) {
        return y * PlaceCanvas.CANVAS_SIZE + x;
    }

    /*
     * Canvas Drawing Functions.
     */
    /**
     * Draws a tile on the canvas. Changes are not reflected in the board
     * @param x
     * @param y
     * @param color
     */
    drawTile(x: number, y: number, color: string) {
        if (!this.ctx) throw new Error("Could not get canvas context");

        x *= PlaceCanvas.TILE_SIZE;
        y *= PlaceCanvas.TILE_SIZE;

        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, PlaceCanvas.TILE_SIZE, PlaceCanvas.TILE_SIZE);
    }

    /**
     * Redraws the entire canvas based on the board array
     */
    drawBoard() {
        for (let i = 0; i < this.board.length; i++) {
            const { x, y } = this.getCanvasCoordsFromIndex(i);
            const color = this.board[i].color;

            this.drawTile(x, y, color);
        }
    }

    /*
     * Cursor Functions.
     */
    selectedTileX = 0;
    selectedTileY = 0;
    selectedTileI = 0;
    clearCursor() {
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                let oldColor =
                    this.board[
                        this.getIndexFromCanvasCoords(
                            this.selectedTileX + dx,
                            this.selectedTileY + dy,
                        )
                    ]?.color;
                if (oldColor)
                    this.drawTile(
                        this.selectedTileX + dx,
                        this.selectedTileY + dy,
                        oldColor,
                    );
            }
        }
    }
    moveCursor(x: number, y: number) {
        if (!this.ctx) throw new Error("Could not get canvas context");
        this.clearCursor();

        let i = this.getIndexFromCanvasCoords(x, y);
        let newColor = this.board[i].color;
        let fillX = x * PlaceCanvas.TILE_SIZE;
        let fillY = y * PlaceCanvas.TILE_SIZE;

        this.ctx.fillStyle = newColor;
        this.ctx.lineWidth = 2;
        this.ctx.fillRect(
            fillX,
            fillY,
            PlaceCanvas.TILE_SIZE,
            PlaceCanvas.TILE_SIZE,
        );
        this.ctx.strokeStyle = "#000";
        this.ctx.strokeRect(
            fillX,
            fillY,
            PlaceCanvas.TILE_SIZE,
            PlaceCanvas.TILE_SIZE,
        );

        this.selectedTileX = x;
        this.selectedTileY = y;
        this.selectedTileI = i;
    }
    showSelectedTile() {
        if (this.zoomFactor < this.INTERACTION_SCALE) {
        }

        let cursorBounds = this.cursor.getBoundingClientRect();
        const { x, y } = this.getCanvasCoordsFromScreenCoords(
            cursorBounds.left,
            cursorBounds.top,
        );

        this.moveCursor(x, y);
    }

    /*
     * Board Functions.
     */
    /**
     * Updates the board and draws the tile
     * @param x
     * @param y
     * @param color
     */
    updateBoard(x: number, y: number, color: string) {
        const i = this.getIndexFromCanvasCoords(x, y);
        console.log(i);
        this.board[i] = { i, color };
        this.drawTile(x, y, color);
    }
    /**
     * Generates a new board
     */
    static generateBoard() {
        let tiles = Array(PlaceCanvas.CANVAS_SIZE * PlaceCanvas.CANVAS_SIZE)
            .fill(0)
            .map((_, i) => {
                let color = "#fff";
                return {
                    i,
                    color,
                };
            });

        return tiles;
    }

    /*
     * Animation loop
     */
    animate() {
        this.canvas.style.left = `${this.xTranslate}px`;
        this.canvas.style.top = `${this.yTranslate}px`;
        this.canvas.style.transform = `scale(${this.zoomFactor})`;

        this.cursor.style.left = `${window.innerWidth / 2}px`;
        this.cursor.style.top = `${window.innerHeight / 2}px`;
        this.cursor.style.transform = `scale(${this.zoomFactor / 10})`;

        if (this.zoomFactor >= this.INTERACTION_SCALE) {
            this.interactionEnabled.set(true);
        } else {
            this.interactionEnabled.set(false);
        }

        requestAnimationFrame(this.animate.bind(this));
    }
}
