import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
    await Promise.all(
        getPosts().map(post => 
            prisma.post.create({ data: post }))
    );
}

seed()
.then(async () => {
    await prisma.$disconnect();
});

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
        },
        {
            title: "Elevator",
            content: `My first time using an elevator was an uplifting experience. The second time let me down.`,
        },
    ];
}