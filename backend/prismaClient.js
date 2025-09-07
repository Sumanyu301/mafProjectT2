// This file is present so that we don't have create prisma client instance in each route file again and again

import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;