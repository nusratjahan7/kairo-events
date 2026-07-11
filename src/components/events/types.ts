export interface EventType {
    _id: string;
    title: string;
    shortDescription: string;
    category: string;
    dateTime: string;
    city: string;
    venue: string;
    price: number;
    imageUrl?: string;
}