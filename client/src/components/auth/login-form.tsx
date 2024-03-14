import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NavLink } from "react-router-dom";

import { LoginPayload, LoginSchema } from "@/lib/schema";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { FloatingLabelInput } from "../ui/floating-label-input";
import { Button } from "../ui/button";
import SocialLogin from "./social-login";

const LoginForm = () => {
  const form = useForm<LoginPayload>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      usernameOrEmail: "",
      password: "",
    },
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-3">
      <Card className="w-[350px] text-center shadow-none border-igElevatedSeparator/40 rounded-sm">
        <CardHeader>
          <p className="text-4xl">Instagram</p>
        </CardHeader>
        <CardContent className="w-full space-y-6">
          <Form {...form}>
            <form className="space-y-4">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="usernameOrEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FloatingLabelInput
                          {...field}
                          type="text"
                          label="Username or email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FloatingLabelInput
                          {...field}
                          type="password"
                          label="Password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                type="submit"
                className="w-full font-semibold text-white"
                variant="primary"
                size="sm"
                disabled
              >
                Log in
              </Button>
            </form>
          </Form>
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-center w-full gap-3">
              <div className="w-full h-[1px] bg-background-accent rounded-full" />
              <span className="text-sm font-medium text-igSecondaryText">
                OR
              </span>
              <div className="w-full h-[1px] bg-background-accent rounded-full" />
            </div>
            <SocialLogin />
            <NavLink
              to="/accounts/password/reset"
              className="text-xs text-muted-foreground"
            >
              Forgot password?
            </NavLink>
          </div>
        </CardContent>
      </Card>
      <Card className="w-[350px] text-center shadow-none border-igElevatedSeparator/40 rounded-sm">
        <CardContent className="flex items-center justify-center h-full p-0">
          <p className="p-5 text-sm">
            Don&apos;t have an account?{" "}
            <NavLink
              to="/accounts/email-sign-up/"
              className="font-semibold text-igPrimary"
            >
              Sign up
            </NavLink>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
export default LoginForm;
