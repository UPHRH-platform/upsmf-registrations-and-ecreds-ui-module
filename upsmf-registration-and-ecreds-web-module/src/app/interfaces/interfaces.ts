export interface ClaimsTableData {
    status: string;
    attachedDocs?: Array<string>;
    claimType?:string;
    id: string;
    entity: string;
    entityId: string;
    createdAt: string;
    updatedAt: string;
    attestedOn: string;
    attestorEntity: string;
    requestorName: string;
    attestationId: string;
    attestationName: string;
    attestorUserId: string;
    closed: boolean;
    notes?: string;
  }

  export interface UsersTableData {
    status: string;
    name: string;
    email:string;
    id: string;
    phoneNumber: string;
    role: string;
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

  export interface StudentDetails {

    date: string | undefined;
    candidatePic: string;
    joiningYear: string;
    fathersName:string;
    gender:string;
    finalYearRollNo:string;
    examBody:string;
    joiningMonth: string;
    passingMonth: string;
    email: string;
    paymentStatus: string;
    feeReciptNo: string;
    aadhaarNo: string;
    dateOfBirth: string | undefined;
    barCode: string;
    nursingCollage: string;
    passingYear: string;
    courseName: string;
    phoneNumber: string;
    registrationType:string;
    council: string;
    mothersName:string;
    name: string;
    docproof: string | string[]; 
    address:string;
  }
  export interface ClaimDetails {
    entityName:string;
    entityId: string;
    name:string;
    propertiesOSID:object;
  }


