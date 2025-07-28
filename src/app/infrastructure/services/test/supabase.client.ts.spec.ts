import { SupabaseClient } from "./../supabase.client.ts";

describe("SupabaseClient", () => {
  it("should create an instance", () => {
    expect(new SupabaseClient()).toBeTruthy();
  });
});
