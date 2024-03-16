import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: [
    {
      "http://localhost:4000/graphql": {
        headers: {
          Authorization: "Bearer gcd1iegdtzb79izbug89n0lqs4wggrm281ay81ap",
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
