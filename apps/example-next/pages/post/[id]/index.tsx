/* eslint-disable @next/next/no-img-element */
import { Layout } from '../../../components/Layout';
import { useRouter } from 'next/router';
import { api } from '../..';
import toast from 'react-hot-toast';
import Link from 'next/link';

export function Index() {
  const router = useRouter();

  const postId = router.query.id as string;

  const { data, error, isLoading } = api.getPost.useQuery([`post-${postId}`], {
    params: { id: postId },
  });

  const { mutate: deletePost } = api.deletePost.useMutation({
    onSuccess: () => {
      router.push('/');
      toast.success('Post deleted!');
    },
  });

  if (error) {
    return (
      <div className="prose w-full h-full flex flex-row justify-center items-center">
        <div>
          <h1>Post not found!</h1>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="prose w-full h-full flex flex-row justify-center items-center">
        <div>
          <h1>Loading...</h1>
          <progress className="progress w-56"></progress>
        </div>
      </div>
    );
  }

  return (
    <div>
      {data?.data ? (
        <div className="prose max-w-none mx-auto px-2 sm:px-0">
          <div className="flex flex-col gap-4 sm:flex-row mb-10">
            <div className="flex flex-col">
              <h1 className="mb-2">{data.data.title}</h1>
              <h3 className="mt-0">{data.data.description}</h3>
            </div>
          </div>

          <p>{data.data.content}</p>

          <div className="flex flex-row gap-2">
            <button
              className="btn btn-error"
              onClick={() => deletePost({ params: { id: data.data.id } })}
            >
              Delete
            </button>
            <Link href={`/post/${data.data.id}/edit`}>
              <button className="btn">Edit</button>
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Index;
