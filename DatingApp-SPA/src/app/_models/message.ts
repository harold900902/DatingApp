export interface Message {

    id: number;
    senderId: number;
    recipientId: number;
    senderPhoto: string;
    senderKnownAs: string;
    recipientPhoto: string;
    recipientKnownAs: string;
    content: string;
    isRead: boolean;
    dateRead?: Date;
    messageSent: Date;

}
