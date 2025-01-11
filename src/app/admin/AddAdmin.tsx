import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "~/components/ui/dialog";
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Button } from '~/components/ui/button';
import { FiPlus, FiMail, FiUser, FiPhone, FiLock, FiUserCheck, FiUserPlus } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '~/trpc/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { PhoneInput } from "~/app/_components/phonenumber";
import { toast } from '~/hooks/use-toast';

const existingUserSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const newUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
});

type ExistingUserForm = z.infer<typeof existingUserSchema>;
type NewUserForm = z.infer<typeof newUserSchema>;

const AddAdminDialog = () => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('existing');
  const [phoneNumber, setPhoneNumber] = useState("");
  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value);
    newUserForm.setValue('phone', value); 
  };
  
  const existingUserForm = useForm<ExistingUserForm>({
    resolver: zodResolver(existingUserSchema),
  });

  const newUserForm = useForm<NewUserForm>({
    resolver: zodResolver(newUserSchema),
  });

  const utils = api.useContext();
  const addAdminMutation = api.settings.addAdmin.useMutation({
    onSuccess: () => {
      utils.admin.invalidate();
      setOpen(false);
      existingUserForm.reset();
      newUserForm.reset();
      toast({
        title: "Success",
        description: "Admin access has been granted successfully",
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  const updateAdminMutation = api.settings.updateAdmin.useMutation({
    onSuccess: () => {
      utils.admin.invalidate();
      setOpen(false);
      existingUserForm.reset();
      newUserForm.reset();
      toast({
        title: "Success",
        description: "Admin access has been granted successfully",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmitExisting = async (data: ExistingUserForm) => {
    updateAdminMutation.mutate({
          email: data.email,
          // Send minimal data for existing user
      });
  };

  const onSubmitNew = async (data: NewUserForm) => {
    await addAdminMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-ssblue hover:bg-ssblue/90">
          <FiPlus className="mr-2 h-4 w-4" />
          Add Admin
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold flex items-center gap-2">
            <FiUser className="h-6 w-6 text-ssblue" />
            Add New Admin
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="existing" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="existing" className="flex items-center gap-2">
              <FiUserCheck className="h-4 w-4" />
              Existing User
            </TabsTrigger>
            <TabsTrigger value="new" className="flex items-center gap-2">
              <FiUserPlus className="h-4 w-4" />
              New User
            </TabsTrigger>
          </TabsList>

          <TabsContent value="existing">
            <form onSubmit={existingUserForm.handleSubmit(onSubmitExisting)} className="space-y-6 py-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="existing-email" className="text-sm font-medium">
                    User Email
                  </Label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      {...existingUserForm.register('email')}
                      id="existing-email"
                      type="email"
                      placeholder="user@example.com"
                      className="pl-10"
                    />
                  </div>
                  {existingUserForm.formState.errors.email && (
                    <p className="text-sm text-red-500">{existingUserForm.formState.errors.email.message}</p>
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="mr-2"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-ssblue hover:bg-ssblue/90"
                  disabled={existingUserForm.formState.isSubmitting}
                >
                  {existingUserForm.formState.isSubmitting ? 'Granting Access...' : 'Grant Admin Access'}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>

          <TabsContent value="new">
            <form onSubmit={newUserForm.handleSubmit(onSubmitNew)} className="space-y-6 py-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-name" className="text-sm font-medium">
                    Full Name
                  </Label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      {...newUserForm.register('name')}
                      id="new-name"
                      placeholder="John Doe"
                      className="pl-10"
                    />
                  </div>
                  {newUserForm.formState.errors.phone && (
    <p className="text-sm text-red-500">{newUserForm.formState.errors.phone.message}</p>
  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      {...newUserForm.register('email')}
                      id="new-email"
                      type="email"
                      placeholder="admin@example.com"
                      className="pl-10"
                    />
                  </div>
                  {newUserForm.formState.errors.email && (
                    <p className="text-sm text-red-500">{newUserForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-phone" className="text-sm font-medium">
                    Phone Number
                  </Label>
                  <div className="relative">
                  
                    <PhoneInput
                      value={phoneNumber}
                      onChange={handlePhoneChange}
                 
                      international
                      defaultCountry="KE"
                    />
                
                  </div>
                  {newUserForm.formState.errors.phone && (
                    <p className="text-sm text-red-500">{newUserForm.formState.errors.phone.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      {...newUserForm.register('password')}
                      id="new-password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                    />
                  </div>
                  {newUserForm.formState.errors.password && (
                    <p className="text-sm text-red-500">{newUserForm.formState.errors.password.message}</p>
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="mr-2"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-ssblue hover:bg-ssblue/90"
                  disabled={newUserForm.formState.isSubmitting}
                >
                  {newUserForm.formState.isSubmitting ? 'Creating...' : 'Create Admin'}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AddAdminDialog;