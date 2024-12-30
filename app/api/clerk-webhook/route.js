import prisma from '@/prisma/client';
import { headers } from 'next/headers';

export async function POST(req) {
  try {
    // Extract the Clerk signature from headers
    const signature = headers().get('clerk-signature');
    if (!signature) {
      return new Response(JSON.stringify({ message: 'Unauthorized: Missing Clerk signature' }), { status: 401 });
    }

    // Parse the request body
    const body = await req.json();
    const { type, data } = body;

    if (!type || !data) {
      return new Response(JSON.stringify({ message: 'Invalid request: Missing type or data' }), { status: 400 });
    }

    // Extract user data
    const { id, email_addresses, first_name, last_name } = data;
    const email = email_addresses[0]?.email_address || null;

    // Perform actions based on the webhook event type
    if (type === 'user.created') {
      // Handle user creation
      const existingUser = await prisma.user.findUnique({ where: { id } });
      if (existingUser) {
        return new Response(JSON.stringify({ message: 'User already exists' }), { status: 200 });
      }

      const newUser = await prisma.user.create({
        data: { id, email, firstName: first_name || '', lastName: last_name || '' },
      });
      console.log('User created:', newUser);
      return new Response(JSON.stringify({ message: 'User created successfully' }), { status: 201 });
    }

    if (type === 'user.updated') {
      // Handle user update
      const updatedUser = await prisma.user.update({
        where: { id },
        data: { email, firstName: first_name, lastName: last_name },
      });
      console.log('User updated:', updatedUser);
      return new Response(JSON.stringify({ message: 'User updated successfully' }), { status: 200 });
    }

    if (type === 'user.deleted') {
      // Handle user deletion
      const deletedUser = await prisma.user.delete({ where: { id } });
      console.log('User deleted:', deletedUser);
      return new Response(JSON.stringify({ message: 'User deleted successfully' }), { status: 200 });
    }

    // If event type is not handled
    return new Response(JSON.stringify({ message: 'Event type not handled' }), { status: 400 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(JSON.stringify({ message: 'Internal server error', error: error.message }), { status: 500 });
  }
}
