import { Author } from "../schemas/author.schema";


/**
 * Paginated authors response interface
 */
export interface IPaginatedAuthorsResponse {
  readonly data: Author[];
  readonly count: number;
}
