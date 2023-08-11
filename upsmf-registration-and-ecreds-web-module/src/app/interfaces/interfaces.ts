export interface ClaimsTableData {
    status: string;
    attachedDocs?: Array<string>;
    claimType?:string;
    id: string,
    entity: string,
    entityId: string,
    createdAt: string,
    updatedAt: string,
    attestedOn: string,
    attestorEntity: string,
    requestorName: string,
    attestationId: string,
    attestationName: string,
    attestorUserId: string,
    closed: boolean
    notes?: string
  }

  export interface UsersTableData {
    status: string;
    name: string;
    email:string;
    id: string,
    phoneNumber: string,
    role: string,
  }

  export interface TableColumn {
    columnDef: string;
    header: string;
    cell: Function;
    isLink?: boolean;
    isAction?: boolean;
    url?: string;
    isMenuOption?: boolean;
    isSortable?: boolean;
  }

  export interface DialogData {
    examsTableColumns: [];
    exams: [];
  }
  export interface claimcolumn {
    councilName:string,
      claimType:string,
      origin:string,
      degree:string,
  }
  export interface studentDetails {
    registrationType: string,
    name:string,
    phoneNumber:string,
    council: string,
    email: string,
    mothersName: string,
    fathersName: string,
    dateOfBirth: string,
    // date: string,
    aadhaarNo: string,
    gender: string,
    courseName: string,
    nursingCollage: string,
    joiningMonth: string,
    joiningYear:  string,
    passingMonth: string,
    passingYear: string,
    finalYearRollNo:string,
    examBody: string    
  }
  export interface claimDetails {
    entityName:string,
    entityId: string,
    name:string,
    propertiesOSID:object;
  }
  