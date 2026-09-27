import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const databasePath = path.join(root, "db.json");
const liveApi = "https://sarohub.com/api";
const collections = [
  "services",
  "projects",
  "team",
  "ventures",
  "testimonials",
  "events",
  "settings",
  "sale-projects",
];

const response = await Promise.all(
  collections.map(async (collection) => {
    const result = await fetch(`${liveApi}/${collection}`);
    if (!result.ok) {
      throw new Error(`${collection}: ${result.status} ${result.statusText}`);
    }
    return [collection, await result.json()];
  }),
);

const database = JSON.parse(await fs.readFile(databasePath, "utf8"));
const liveData = Object.fromEntries(response);

database.services = liveData.services;
database.projects = liveData.projects;
database.team_members = liveData.team;
database.ventures = liveData.ventures;
database.testimonials = liveData.testimonials;
database.events = liveData.events;
database.settings = liveData.settings;
database.sale_projects = liveData["sale-projects"];
database.products = [];

await fs.writeFile(
  databasePath,
  `${JSON.stringify(database, null, 2)}\n`,
  "utf8",
);

console.log(
  `Synced ${database.services.length} services, ${database.projects.length} projects, ${database.team_members.length} team members, ${database.ventures.length} ventures, ${database.testimonials.length} testimonials, and ${database.events.length} event.`,
);
console.log(
  "Cleared local demo products and sale projects because the live marketplace is empty.",
);
