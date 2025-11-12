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

//Inngest function to save dato the database
const syncWorkspaceCreation = inngest.createFunction(
      {id:'sync-workspace-with-clerk' },
      {event: 'clerk/organization.created'},
      async ({ event }) => {
        // Function logic goes here
        const {data} = event;
      await prisma.workspace.create({
          data: {
              id:data.id,
              name:data.name,
              slug:data.slug,
              ownerId:data.created_by,
              image_url:data.image_url || null,
          }
      })
      //Add creator as admin member
      await prisma.workspaceMember.create({
        data: {
            userId:data.created_by,
            workspaceId:data.id,
            role:'ADMIN',
        }
    })

      }
);


//Inngest function to update workspace data in the database
const syncWorkspaceUpdation = inngest.createFunction(
      {id:'update-workspace-with-clerk' },
      {event: 'clerk/organization.updated'},
      async ({ event }) => {
        // Function logic goes here
        const {data} = event;
      await prisma.workspace.update({
          where: {
              id:data.id,
          },
          data: {
              name:data.name,
              slug:data.slug,
              image_url:data.image_url || null,
          }
      })
      }
);

//Inngest function to delete workspace from the database
const syncWorkspaceDeletion = inngest.createFunction(
      {id:'delete-workspace-with-clerk' },
      {event: 'clerk/organization.deleted'},
      async ({ event }) => {
        // Function logic goes here
        const {data} = event;
      await prisma.workspace.delete({
          where: {
              id:data.id,
          }
      })
    }
  )


  //Inngest function to add member to workspace in the database
const syncWorkspaceMemberCreation = inngest.createFunction(
      {id:'add-member-to-workspace-with-clerk' },
      {event: 'clerk/organizationInvitation.accepted'},
      async ({ event }) => {
        // Function logic goes here
        const {data} = event;
      await prisma.workspaceMember.create({
          data: {
              userId:data.user_id,
              workspaceId:data.organization_id,
              role:String(data.role_name).toUpperCase(),
          }
      })
      }
);

// Create an empty array where we'll export future Inngest functions


export const functions = [
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdate,
  syncWorkspaceCreation,
  syncWorkspaceUpdation,
  syncWorkspaceDeletion,
  syncWorkspaceMemberCreation
];