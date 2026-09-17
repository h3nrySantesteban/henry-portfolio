import { BlogPostForm } from "@/components/admin/blog/BlogPostForm";

export default function NewBlogPostPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Nuevo artículo</h1>
      <div className="mt-8">
        <BlogPostForm />
      </div>
    </div>
  );
}
