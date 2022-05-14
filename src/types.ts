
export interface ApiError {
  message: string | undefined;
}

export interface HisClassTypes {
    id: string;
    students: string[];
    name: string;
  }

export interface StudentType {
  id: string;
  studentName: string;
  classes: HisClassTypes[];
}
