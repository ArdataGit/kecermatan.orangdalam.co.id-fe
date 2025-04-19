import useGetList from '@/hooks/use-get-list';
import { imageLink } from '@/utils/image-link';
import moment from 'moment/min/moment-with-locales';
import { Link } from 'react-router-dom';

export default function Event() {
  const posts = useGetList({
    url: 'user/event/get',
    initialParams: {
      skip: 0,
      take: 10,
      sortBy: 'createdAt',
      descending: true,
    },
  });

  return (
    <div className="  min-h-screen">
      <div className="mx-auto ">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight mt-10 text-gray-900 sm:text-4xl">
            Event Terbaru
          </h2>
        </div>
        <div className=" grid  auto-rows-fr grid-cols-1 gap-8 mt-10 lg:mx-0 lg:max-w-none lg:grid-cols-4">
          {posts.list.map((post) => (
            <article
              key={post.id}
              className="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 px-8 pb-8 pt-80 sm:pt-48 lg:pt-80"
            >
              <img
                src={imageLink(post.gambar)}
                alt=""
                className="absolute inset-0 -z-10 h-full w-full object-cover"
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/40" />
              <div className="absolute inset-0 -z-10 rounded-2xl ring-1 ring-inset ring-gray-900/10" />

              <div className="flex flex-wrap items-center gap-y-1 overflow-hidden text-sm leading-6 text-gray-300">
                <time dateTime={post.datetime} className="mr-8">
                  {moment(post.createdAt).format('DD MMMM YYYY')}
                </time>
                <div className="-ml-4 flex items-center gap-x-4">
                  <svg
                    viewBox="0 0 2 2"
                    className="-ml-0.5 h-0.5 w-0.5 flex-none fill-white/50"
                  >
                    <circle cx={1} cy={1} r={1} />
                  </svg>
                </div>
              </div>
              <h3 className="mt-3 text-lg font-semibold leading-6 text-white">
                <Link to={`/event/detail/${post.id}`}>
                  <span className="absolute inset-0" />
                  {post.nama}
                </Link>
              </h3>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
