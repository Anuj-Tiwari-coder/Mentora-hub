import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Shield, Users, Zap } from "lucide-react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SignedIn>
        {children}
      </SignedIn>
      <SignedOut>
        <div className="min-h-screen bg-gradient-calm flex items-center justify-center p-4">
          <div className="max-w-md w-full space-y-8">
            {/* Logo & Brand */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-primary rounded-xl flex items-center justify-center shadow-medium">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-poppins font-bold gradient-text mb-2">
                Welcome to Mentora
              </h1>
              <p className="text-lg text-muted-foreground">
                Your personal mental health companion
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 my-8">
              <div className="text-center p-4">
                <Shield className="h-8 w-8 mx-auto mb-2 text-therapeutic-blue" />
                <p className="text-sm font-medium">Secure & Private</p>
              </div>
              <div className="text-center p-4">
                <Users className="h-8 w-8 mx-auto mb-2 text-therapeutic-green" />
                <p className="text-sm font-medium">AI Support</p>
              </div>
              <div className="text-center p-4">
                <Zap className="h-8 w-8 mx-auto mb-2 text-therapeutic-purple" />
                <p className="text-sm font-medium">Mood Tracking</p>
              </div>
              <div className="text-center p-4">
                <Heart className="h-8 w-8 mx-auto mb-2 text-therapeutic-orange" />
                <p className="text-sm font-medium">Wellness Tools</p>
              </div>
            </div>

            {/* Auth Card */}
            <Card className="card-therapeutic p-8 text-center">
              <h2 className="text-xl font-semibold mb-6">
                Start Your Wellness Journey
              </h2>
              
              <div className="space-y-4">
                <SignInButton mode="modal" fallbackRedirectUrl="/">
                  <Button className="btn-therapeutic w-full">
                    Sign In
                  </Button>
                </SignInButton>
                
                <SignUpButton mode="modal" fallbackRedirectUrl="/">
                  <Button variant="outline" className="w-full">
                    Create Account
                  </Button>
                </SignUpButton>
              </div>
              
              <p className="text-sm text-muted-foreground mt-6">
                Your data is encrypted and secure. We respect your privacy.
              </p>
            </Card>
          </div>
        </div>
      </SignedOut>
    </>
  );
};

export default AuthLayout;