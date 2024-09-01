import { expect, test } from "bun:test";
import type { Tile } from "@prisma/client";
import { PlaceCanvas } from "../lib/place/PlaceCanvas";

const ORIGIN = 'https://bdekraken.fr/';
const sessionId = 'MDUxZjIyYTAtYTE1NS00ZDFhLTgxZDgtMWQyNWZhMzE0MGYz';
const sessionCookie = `session=${sessionId}`;

async function placePixel(x: number, y: number, color: string) {
  const url = new URL('/api/place/tile/draw', ORIGIN);
  const response = await fetch(url, {
    headers: {
      'Cookie': sessionCookie,
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({ x, y, color }),
  });

  return response;
}

async function getCanvas() {
  const url = new URL('/api/place/canvas', ORIGIN);
  const response = await fetch(url);

  return response.json() as Promise<{
    tiles: Tile[];
  }>;
}

test('place two pixels at the same time', async () => {
  const [response1, response2] = await Promise.all([
    placePixel(0, 0, PlaceCanvas.CANVAS_PALETTE[1]),
    placePixel(0, 1, PlaceCanvas.CANVAS_PALETTE[2]),
  ]);

  expect(response1.ok !== response2.ok).toBe(true);

  const canvas = await getCanvas();
  if (response1.ok)
    expect(canvas.tiles.find(t => t.i === 0)?.color).toBe(PlaceCanvas.CANVAS_PALETTE[1]);
  if (response2.ok)
    expect(canvas.tiles.find(t => t.i === 1)?.color).toBe(PlaceCanvas.CANVAS_PALETTE[2]);
});
