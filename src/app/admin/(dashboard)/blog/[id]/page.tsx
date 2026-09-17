import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BlogPostForm } from "@/components/admin/blog/BlogPostForm";

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase.from("blog_posts").select("*").eq("id", id).maybeSingle();

  if (!post) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Editar artículo</h1>
      <div className="mt-8">
        <BlogPostForm initial={post} />
      </div>
    </div>
  );
}
