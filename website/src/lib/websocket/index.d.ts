type WSMessageTypes = "place.update";

export interface WSMessage {
    type: string;
    data: any;
}

export interface WSMessagePlaceUpdate extends WSMessage {
    type: "place.update";
    data: {
        x: number;
        y: number;
        color: string;
    };
}
