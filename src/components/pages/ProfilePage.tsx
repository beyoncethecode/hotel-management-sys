import { useMember } from '@/integrations';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export default function ProfilePage() {
  const { member } = useMember();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="w-full max-w-[100rem] mx-auto px-8 py-16 min-h-[60vh]">
        <h1 className="font-heading text-5xl md:text-6xl text-black mb-12">
          YOUR PROFILE
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Profile Info Card */}
          <Card className="bg-cream border-2 border-black rounded-2xl">
            <CardHeader>
              <CardTitle className="font-heading text-2xl text-black">
                ACCOUNT INFORMATION
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4">
                <User className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="font-heading text-sm text-black/60 mb-1">Name</p>
                  <p className="font-paragraph text-base text-black">
                    {member?.profile?.nickname || member?.contact?.firstName || 'Not set'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="font-heading text-sm text-black/60 mb-1">Email</p>
                  <p className="font-paragraph text-base text-black">
                    {member?.loginEmail || 'Not available'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Calendar className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="font-heading text-sm text-black/60 mb-1">Member Since</p>
                  <p className="font-paragraph text-base text-black">
                    {member?._createdDate ? format(new Date(member._createdDate), 'MMMM dd, yyyy') : 'Unknown'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Card */}
          <Card className="bg-primary border-2 border-black rounded-2xl">
            <CardHeader>
              <CardTitle className="font-heading text-2xl text-primary-foreground">
                ACCOUNT STATUS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="font-heading text-sm text-primary-foreground/80 mb-1">Status</p>
                <p className="font-paragraph text-base text-primary-foreground">
                  {member?.status || 'Active'}
                </p>
              </div>

              <div>
                <p className="font-heading text-sm text-primary-foreground/80 mb-1">Email Verified</p>
                <p className="font-paragraph text-base text-primary-foreground">
                  {member?.loginEmailVerified ? 'Yes' : 'No'}
                </p>
              </div>

              <div>
                <p className="font-heading text-sm text-primary-foreground/80 mb-1">Last Login</p>
                <p className="font-paragraph text-base text-primary-foreground">
                  {member?.lastLoginDate ? format(new Date(member.lastLoginDate), 'MMMM dd, yyyy') : 'Unknown'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
