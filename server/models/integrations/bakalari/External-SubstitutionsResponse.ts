interface Entity {
  Id: string;
  Abbrev: string;
  Name: string;
}

export enum ChangeTypes {
  SUPPLEMENTING = "supluje",
  CANCELLED = "odpadá",
  MOVED = "přesun <<",
  MERGED = "spojí",
}

export interface SubstitutionsResponse {
  HourLabels: string[];
  AbsentClasses: Array<{
    Entity: Entity;
    /** Array with the index being the hour and value being the reason. */
    Reasons: Array<string | null>;
  }>;
  AbsentTeachers: Array<{
    Entity: Entity;
    Reasons: Array<string | null>;
  }>;
  AbsentRooms: Array<{
    Entity: Entity;
    Reasons: Array<string | null>;
  }>;
  ChangesForClasses: Array<{
    Class: Entity;
    ChangedLessons: Array<{
      /** Reason */
      ChgType1: ChangeTypes;
      /** The teacher which was supposed to teach. */
      ChgType2: string;
      Hour: string;
      Subject: string;
      Group: string;
      Room: string;
      /** The actual teacher. */
      Teacher: string;
    }>;
    CancelledLessons: Array<{
      /** Reason */
      ChgType1: ChangeTypes;
      /** The teacher which was supposed to teach. */
      ChgType2: string;
      Hour: string;
      Subject: string;
      Group: string;
    }>;
    // WTF - I don't understand this one bit. :C
    /** If there are any changes in `AbsentClasses`, this provides the labels for those. */
    ChangedGroups: string[];
  }>;
}
