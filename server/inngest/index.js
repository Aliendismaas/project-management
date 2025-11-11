import { Inngest } from "inngest";
import prisma from "../config/prisma.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "my-app" });

//Inggest function to create user to the database when a user is created in Clerk
  const syncUserCreation = inngest.createFunction(
        {id:'sync-user-from-clerk' },
        {event: 'clerk/user.created'},
        async ({ event }) => {
          // Function logic goes here
          const {data} = event;
        await prisma.user.create({
            data: {
                id:data.id,
                email:data?.email_addresses[0]?.email_address,
                name:data?.first_name + ' ' + data?.last_name,
                image:data?.image_url || null,
            }
        })
        }
);

  const syncUserDeletion = inngest.createFunction(
        {id:'delete-user-with-clerk' },
        {event: 'clerk/user.deleted'},
        async ({ event }) => {
          // Function logic goes here
          const {data} = event;
        await prisma.user.delete({
            where: {
                id:data.id,
            }
        })
        }
);

//Inngest function to update user in the database when a user is updated in Clerk
  const syncUserUpdate = inngest.createFunction(
        {id:'update-user-from-clerk' },
        {event: 'clerk/user.updated'},
        async ({ event }) => {
          // Function logic goes here
          const {data} = event;
        await prisma.user.update({
            where: {
                id:data.id,
            },
            data: {
                email:data?.email_addresses[0]?.email_address,
                name:data?.first_name + ' ' + data?.last_name,
                image:data?.image_url || null,
            }
        })
        }
);

// Create an empty array where we'll export future Inngest functions


export const functions = [
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdate
];