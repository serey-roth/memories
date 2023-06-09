import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
    const bob = await prisma.user.create({
        data: {
            username: "bob",
            email: "bob@bob.com",
            password: bcrypt.hashSync("bobbob", 10)
        }
    });
    const jim = await prisma.user.create({
        data: {
            username: "jim",
            email: "jim@jim.com",
            password: bcrypt.hashSync("jimjim", 10)
        }
    });
    const users = [bob, jim];

    await Promise.all(
        getPosts().map(post => 
            prisma.post.create({ 
                data: {
                    ...post,
                    creatorId: users[Math.floor(Math.random() * 2)].id
                }
            }))
    );
}

seed();

function getPosts() {
    return [
        {
            title: "Road worker",
            content: `I never wanted to believe that my Dad was stealing from his job as a road worker. But when I got home, all the signs were there.`,
        },
        {
            title: "Frisbee",
            content: `I was wondering why the frisbee was getting bigger, then it hit me.`,
        },
        {
            title: "Trees",
            content: `Why do trees seem suspicious on sunny days? Dunno, they're just a bit shady.`,
        },
        {
            title: "Skeletons",
            content: `Why don't skeletons ride roller coasters? They don't have the stomach for it.`,
        },
        {
            title: "Hippos",
            content: `Why don't you find hippopotamuses hiding in trees? They're really good at it.`,
        },
        {
            title: "Dinner",
            content: `What did one plate say to the other plate? Dinner is on me!`,
        },
        {
            title: "Elevator",
            content: `My first time using an elevator was an uplifting experience. The second time let me down.`,
        },
        {
            title: "Road worker",
            content: `I never wanted to believe that my Dad was stealing from his job as a road worker. But when I got home, all the signs were there.`,
        },
        {
            title: "Frisbee",
            content: `I was wondering why the frisbee was getting bigger, then it hit me.`,
        },
        {
            title: "Trees",
            content: `Why do trees seem suspicious on sunny days? Dunno, they're just a bit shady.`,
        },
        {
            title: "Skeletons",
            content: `Why don't skeletons ride roller coasters? They don't have the stomach for it.`,
        },
        {
            title: "Hippos",
            content: `Why don't you find hippopotamuses hiding in trees? They're really good at it.`,
        },
        {
            title: "Dinner",
            content: `What did one plate say to the other plate? Dinner is on me!`,
        },
        {
            title: "Elevator",
            content: `My first time using an elevator was an uplifting experience. The second time let me down.`,
        },
        {
            title: "Road worker",
            content: `I never wanted to believe that my Dad was stealing from his job as a road worker. But when I got home, all the signs were there.`,
        },
        {
            title: "Frisbee",
            content: `I was wondering why the frisbee was getting bigger, then it hit me.`,
        },
        {
            title: "Trees",
            content: `Why do trees seem suspicious on sunny days? Dunno, they're just a bit shady.`,
        },
        {
            title: "Skeletons",
            content: `Why don't skeletons ride roller coasters? They don't have the stomach for it.`,
        },
        {
            title: "Hippos",
            content: `Why don't you find hippopotamuses hiding in trees? They're really good at it.`,
        },
        {
            title: "Dinner",
            content: `What did one plate say to the other plate? Dinner is on me!`,
        },
        {
            title: "Elevator",
            content: `My first time using an elevator was an uplifting experience. The second time let me down.`,
        },
        {
            title: "Road worker",
            content: `I never wanted to believe that my Dad was stealing from his job as a road worker. But when I got home, all the signs were there.`,
        },
        {
            title: "Frisbee",
            content: `I was wondering why the frisbee was getting bigger, then it hit me.`,
        },
        {
            title: "Trees",
            content: `Why do trees seem suspicious on sunny days? Dunno, they're just a bit shady.`,
        },
        {
            title: "Skeletons",
            content: `Why don't skeletons ride roller coasters? They don't have the stomach for it.`,
        },
        {
            title: "Hippos",
            content: `Why don't you find hippopotamuses hiding in trees? They're really good at it.`,
        },
        {
            title: "Dinner",
            content: `What did one plate say to the other plate? Dinner is on me!`,
        },
        {
            title: "Elevator",
            content: `My first time using an elevator was an uplifting experience. The second time let me down.`,
        },
        {
            title: "Road worker",
            content: `I never wanted to believe that my Dad was stealing from his job as a road worker. But when I got home, all the signs were there.`,
        },
        {
            title: "Frisbee",
            content: `I was wondering why the frisbee was getting bigger, then it hit me.`,
        },
        {
            title: "Trees",
            content: `Why do trees seem suspicious on sunny days? Dunno, they're just a bit shady.`,
        },
        {
            title: "Skeletons",
            content: `Why don't skeletons ride roller coasters? They don't have the stomach for it.`,
        },
        {
            title: "Hippos",
            content: `Why don't you find hippopotamuses hiding in trees? They're really good at it.`,
        },
        {
            title: "Dinner",
            content: `What did one plate say to the other plate? Dinner is on me!`,
        },
        {
            title: "Elevator",
            content: `My first time using an elevator was an uplifting experience. The second time let me down.`,
        },
        {
            title: "Road worker",
            content: `I never wanted to believe that my Dad was stealing from his job as a road worker. But when I got home, all the signs were there.`,
        },
        {
            title: "Frisbee",
            content: `I was wondering why the frisbee was getting bigger, then it hit me.`,
        },
        {
            title: "Trees",
            content: `Why do trees seem suspicious on sunny days? Dunno, they're just a bit shady.`,
        },
        {
            title: "Skeletons",
            content: `Why don't skeletons ride roller coasters? They don't have the stomach for it.`,
        },
        {
            title: "Hippos",
            content: `Why don't you find hippopotamuses hiding in trees? They're really good at it.`,
        },
        {
            title: "Dinner",
            content: `What did one plate say to the other plate? Dinner is on me!`,
        },
        {
            title: "Elevator",
            content: `My first time using an elevator was an uplifting experience. The second time let me down.`,
        },{
            title: "Road worker",
            content: `I never wanted to believe that my Dad was stealing from his job as a road worker. But when I got home, all the signs were there.`,
        },
        {
            title: "Frisbee",
            content: `I was wondering why the frisbee was getting bigger, then it hit me.`,
        },
        {
            title: "Trees",
            content: `Why do trees seem suspicious on sunny days? Dunno, they're just a bit shady.`,
        },
        {
            title: "Skeletons",
            content: `Why don't skeletons ride roller coasters? They don't have the stomach for it.`,
        },
        {
            title: "Hippos",
            content: `Why don't you find hippopotamuses hiding in trees? They're really good at it.`,
        },
        {
            title: "Dinner",
            content: `What did one plate say to the other plate? Dinner is on me!`,
        },
        {
            title: "Elevator",
            content: `My first time using an elevator was an uplifting experience. The second time let me down.`,
        },
        {
            title: "Road worker",
            content: `I never wanted to believe that my Dad was stealing from his job as a road worker. But when I got home, all the signs were there.`,
        },
        {
            title: "Frisbee",
            content: `I was wondering why the frisbee was getting bigger, then it hit me.`,
        },
        {
            title: "Trees",
            content: `Why do trees seem suspicious on sunny days? Dunno, they're just a bit shady.`,
        },
        {
            title: "Skeletons",
            content: `Why don't skeletons ride roller coasters? They don't have the stomach for it.`,
        },
        {
            title: "Hippos",
            content: `Why don't you find hippopotamuses hiding in trees? They're really good at it.`,
        },
        {
            title: "Dinner",
            content: `What did one plate say to the other plate? Dinner is on me!`,
        },
        {
            title: "Elevator",
            content: `My first time using an elevator was an uplifting experience. The second time let me down.`,
        },
    ];
}