import { usePathname, useSearchParams } from "next/navigation";
import { PaginationArrow } from "./PaginationArrow";

interface PaginationProps {
  pageCount: string;
}

export function PaginationComponent({ pageCount }: Readonly<PaginationProps>) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <nav role="navigation" aria-label="Pagination" className="pagination-nav">
      <ul className="pagination-list">
        <li>
          <PaginationArrow
            direction="left"
            href={createPageURL(currentPage - 1)}
            isDisabled={currentPage <= 1}
          />
        </li>
        <li>
          <span className="page-number">Page {currentPage}</span>
        </li>
        <li>
          <PaginationArrow
            direction="right"
            href={createPageURL(currentPage + 1)}
            isDisabled={currentPage >= +pageCount}
          />
        </li>
      </ul>
    </nav>
  );
}
