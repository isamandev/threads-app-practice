'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserValidation } from '@/lib/validations/user';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Textarea } from '../ui/textarea';
import { UploadButton } from '@/lib/uploadthing';
import { updateUser } from '@/lib/actions/user.actions';

interface Props {
	user: {
		id: string;
		objectId: string;
		username: string;
		name: string;
		bio: string;
		image: string;
	};
	btnTitle: string;
}

function AccountProfile({ user, btnTitle }: Props) {
	const router = useRouter();
	const pathname = usePathname();

	const form = useForm<z.infer<typeof UserValidation>>({
		resolver: zodResolver(UserValidation),
		defaultValues: {
			profile_photo: user?.image ? user.image : '',
			name: user?.name ? user.name : '',
			username: user?.username ? user.username : '',
			bio: user?.bio ? user.bio : '',
		},
	});

	const onSubmit = async (values: z.infer<typeof UserValidation>) => {
		await updateUser({
			name: values.name,
			path: pathname,
			username: values.username,
			userId: user.id,
			bio: values.bio,
			image: values.profile_photo,
		});

		if (pathname === '/profile/edit') {
			router.back();
		} else {
			router.push('/');
		}
	};

	return (
		<Form {...form}>
			<form
				className='flex flex-col justify-start gap-10'
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<FormField
					control={form.control}
					name='profile_photo'
					render={({ field }) => (
						<FormItem className='flex items-center gap-4'>
							<FormLabel className='account-form_image-label'>
								{field.value ? (
									<Image
										src={field.value}
										alt='profile_icon'
										width={96}
										height={96}
										priority
										className='rounded-full object-contain'
									/>
								) : (
									<Image
										src='/assets/profile.svg'
										alt='profile_icon'
										width={24}
										height={24}
										className='object-contain'
									/>
								)}
							</FormLabel>
							<FormControl className='flex-1 text-base-semibold text-gray-200'>
								<UploadButton
									endpoint='media'
									onClientUploadComplete={(res) => {
										if (res && res[0]?.url) {
											field.onChange(res[0].url);
										}
									}}
									onUploadError={(error) => {
										console.error('Upload error:', error);
									}}
								/>
							</FormControl>
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='name'
					render={({ field }) => (
						<FormItem className='flex w-full flex-col gap-3'>
							<FormLabel className='text-base-semibold text-light-2'>Name</FormLabel>
							<FormControl>
								<Input type='text' className='account-form_input no-focus' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='username'
					render={({ field }) => (
						<FormItem className='flex w-full flex-col gap-3'>
							<FormLabel className='text-base-semibold text-light-2'>Username</FormLabel>
							<FormControl>
								<Input type='text' className='account-form_input no-focus' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='bio'
					render={({ field }) => (
						<FormItem className='flex w-full flex-col gap-3'>
							<FormLabel className='text-base-semibold text-light-2'>Bio</FormLabel>
							<FormControl>
								<Textarea rows={10} className='account-form_input no-focus' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type='submit' className='bg-primary-500'>
					{btnTitle}
				</Button>
			</form>
		</Form>
	);
}
export default AccountProfile;