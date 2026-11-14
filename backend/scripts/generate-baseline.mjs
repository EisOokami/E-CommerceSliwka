import { mkdir, writeFile, access } from "node:fs/promises";
import { generateDrizzleJson, generateMigration } from "drizzle-kit/api";
import * as schema from "../src/db/schema.ts";

const baseline = new URL(
    "../migrations/baseline/0000_initial.sql",
    import.meta.url,
);

const exists = await access(baseline).then(
    () => true,
    () => false,
);

if (exists) {
    throw new Error(
        "Baseline already exists. Add a new migration instead of rewriting deployed SQL.",
    );
}

const empty = generateDrizzleJson({});
const snapshot = generateDrizzleJson(schema, empty.id);
const statements = await generateMigration(empty, snapshot);

await mkdir(new URL("../migrations/baseline/meta/", import.meta.url), {
    recursive: true,
});

await writeFile(
    baseline,
    statements
        .map((statement) => statement.replace(/;+\s*$/, ""))
        .join(";\n--> statement-breakpoint\n") + ";\n",
);

await writeFile(
    new URL("../migrations/baseline/meta/0000_snapshot.json", import.meta.url),
    JSON.stringify(snapshot, null, 2),
);

await writeFile(
    new URL("../migrations/baseline/meta/_journal.json", import.meta.url),
    JSON.stringify(
        {
            version: "7",
            dialect: "postgresql",
            entries: [
                {
                    idx: 0,
                    version: "7",
                    when: 1790726400000,
                    tag: "0000_initial",
                    breakpoints: true,
                },
            ],
        },
        null,
        2,
    ),
);

console.log("Generated baseline: " + statements.length + " SQL statements");
