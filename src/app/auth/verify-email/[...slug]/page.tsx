"use client";

import { useEffect, useState } from "react";
import { verifyEmailAction, resendEmailAction } from "@/modules/auth/actions/auth.actions";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/modules/auth/context/auth-provider";

export default function VerifyEmailPage({ params }: { params: { slug: string[] } }) {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const searchParams = useSearchParams();
  const { user } = useAuth();

  useEffect(() => {
    const verify = async () => {
      if (!params.slug || params.slug.length < 2) {
        setStatus("error");
        setMessage("Invalid verification link format.");
        return;
      }

      const [id, hash] = params.slug;
      const expires = searchParams.get("expires");
      const signature = searchParams.get("signature");

      if (!expires || !signature) {
        setStatus("error");
        setMessage("Missing signature parameters.");
        return;
      }

      const relativeUrl = `/email/verify/${id}/${hash}?expires=${expires}&signature=${signature}`;

      const result = await verifyEmailAction(relativeUrl);

      if (result.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setMessage(result.error || "Verification failed. The link may be invalid or expired.");
      }
    };

    verify();
  }, [params.slug, searchParams]);

  const handleResend = async () => {
    if (!user?.email) return;
    setMessage("Sending...");
    const result = await resendEmailAction(user.email);
    if (result.success) {
      setMessage("Verification email resent successfully!");
    } else {
      setMessage(result.error || "Failed to resend email.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Email Verification</CardTitle>
          <CardDescription>We are verifying your email address.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          {status === "loading" && (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p>Verifying...</p>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center gap-4">
              <div className="text-green-500 font-medium text-lg">Verification Successful!</div>
              <p className="text-center text-sm text-muted-foreground">
                Thank you for verifying your email. You can now access all features.
              </p>
              <Button asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center gap-4">
              <div className="text-red-500 font-medium text-lg">Verification Failed</div>
              <p className="text-center text-sm text-muted-foreground">{message}</p>
              
              {user && (
                <Button onClick={handleResend} variant="outline">
                  Resend Verification Email
                </Button>
              )}
              
              {!user && (
                  <Button asChild variant="link">
                      <Link href="/login">Back to Login</Link>
                  </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
