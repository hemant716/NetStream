"use server"
import { z } from "zod";
import { prisma } from "../lib/prisma"
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


//zod schema
const uploadVideoSchema = z.object({
    movieName: z.string().min(1, "movie name required"),
    description: z.string().min(1, "description is required"),
    category: z.string().min(1, "category is required"),
    videoUrl: z.string().url("invalid video url"),
    thumbnailUrl: z.string().optional()
});

type UploadVideoFormState = {
    errors: {
        movieName?: string[];
        description?: string[];
        category?: string[];
        thumbnailUrl?: string[];
        videoUrl?: string[];
        formErrors?: string[];
    }
};


export const uploadVideo = async (prevState: UploadVideoFormState, formData: FormData): Promise<UploadVideoFormState> => {

    const result = uploadVideoSchema.safeParse(Object.fromEntries(formData));

    if (!result.success) {
        return {
            errors: result.error.flatten().fieldErrors
        }  
    }
 
    try {

        const { movieName, description, category, videoUrl , thumbnailUrl} = result.data;
        await prisma.movie.create({
            data: {
                movieName,
                description,
                category,
                videoUrl,
                thumbnailUrl
            }
        })
    } catch (error) {
        if (error instanceof Error) {
            return {
                errors: {
                    formErrors: [error.message]
                }
            }
        } else {
            return {
                errors: {
                    formErrors: ["An unexpected error occurred"]
                }
            }
        }
    }
    revalidatePath("/");
    redirect("/");
}