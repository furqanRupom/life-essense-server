import { BloodGroup } from "@prisma/client";

export interface UserData {
    name: string;
    email: string;
    password: string;
    bloodType: BloodGroup;
    location: string;
    age: number;
    bio: string;
    lastDonationDate: string;
}