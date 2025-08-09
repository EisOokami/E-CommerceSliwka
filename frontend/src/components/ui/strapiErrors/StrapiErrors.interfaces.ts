export interface StrapiErrorsProps {
    error:
        | {
              message: string | null;
              name: string;
              status: string | null;
          }
        | {
              path: string;
              message: string;
              name: string;
              value: string;
          };
}
