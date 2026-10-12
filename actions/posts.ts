'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { storePost, updatePostLikeStatus } from '@/lib/posts';
import { uploadImage } from '@/lib/cloudinary';

export interface FormState {
  errors?: string[];
}

export async function createPost(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const title = formData.get('title') as string | null;
  const image = formData.get('image') as File | null;
  const content = formData.get('content') as string | null;

  const errors: string[] = [];

  if (!title || title.trim().length === 0) {
    errors.push('Title is required.');
  }

  if (!content || content.trim().length === 0) {
    errors.push('Content is required.');
  }

  if (!image || image.size === 0) {
    errors.push('Image is required.');
  }

  if (errors.length > 0) {
    return { errors };
  }

  let imageUrl: string;

  try {
    imageUrl = await uploadImage(image!);
  } catch (error) {
    throw new Error(
      'Image upload failed, post was not created. Please try again later.'
    );
  }

  await storePost({
    imageUrl,
    title: title!,
    content: content!,
    userId: 1,
  });

  revalidatePath('/', 'layout');
  redirect('/feed');
}

export async function togglePostLikeStatus(postId: number): Promise<void> {
  await updatePostLikeStatus(postId, 2);
  revalidatePath('/', 'layout');
}
