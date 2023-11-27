type WSMessageTypes = "place.update";

export interface WSMessage {
    type: string;
    secret?: string;
    data: any;
}

export interface WSMessagePlaceUpdate extends WSMessage {
    type: "place.update";
    data: {
        i: number;
        x: number;
        y: number;
        color: string;
    };
}
