import { RichText } from "@/components/RichText";
import { formatWritingDate, type WritingArticle } from "@/lib/writing";

export function WritingArticleView({ article }: { article: WritingArticle }) {
  return (
    <article className="writing-article">
      <header className="writing-article-header">
        <h1>{article.title || "Untitled"}</h1>
        <p>
          <time dateTime={article.writtenAt}>
            {formatWritingDate(article.writtenAt)}
          </time>
        </p>
      </header>
      <div className="writing-article-body">
        {article.blocks.map((block) => {
          if (block.type === "heading") {
            return <h2 key={block.id}><RichText text={block.text} formatting /></h2>;
          }
          if (block.type === "subheading") {
            return <h3 key={block.id}><RichText text={block.text} formatting /></h3>;
          }
          if (block.type === "image") {
            return block.url ? (
              <figure key={block.id}>
                <img src={block.url} alt={block.alt} />
                {block.alt && <figcaption>{block.alt}</figcaption>}
              </figure>
            ) : null;
          }
          return block.text ? (
            <p key={block.id}><RichText text={block.text} formatting /></p>
          ) : <div className="writing-space" key={block.id} />;
        })}
      </div>
    </article>
  );
}
