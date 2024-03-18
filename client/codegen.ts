import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: [
    {
      "http://localhost:4000/graphql": {
        headers: {
          Authorization: "Bearer 3wis2v09c87wuu24pc504ifwa5ir2ceyj8enzhp8",
        },
      },
    },
  ],
  documents: ["src/**/*.{ts,tsx}"],
  generates: {
    "./src/lib/graphql/__generated__/": {
      preset: "client",
      plugins: [],
      presetConfig: {
        gqlTagName: "gql",
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
