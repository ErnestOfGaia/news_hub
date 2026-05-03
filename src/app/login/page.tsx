export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  const isError = params.error === '1';

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-stone-900">Admin Login</h1>
        </div>

        <form action="/api/admin/login" method="POST" className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-stone-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 text-stone-900 shadow-sm focus:border-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900 sm:text-sm"
            />
          </div>

          {isError && (
            <div className="text-red-600 text-sm">
              Incorrect password.
            </div>
          )}

          <button
            type="submit"
            className="flex w-full justify-center rounded-md border border-transparent bg-stone-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:ring-offset-2"
          >
            Log in
          </button>
        </form>
      </div>
    </div>
  );
}
