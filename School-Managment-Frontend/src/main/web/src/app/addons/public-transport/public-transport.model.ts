export class PublicTransport {
  public _showPublicTransport: boolean;

  public startTime: string;

  public endTime: string;

  public set startTimeDate(startTime: Date) {
    this.startTime = startTime.getHours + ":" + startTime.getMinutes;
  }

  public get startTimeDate(): Date {
    if (this.endTime) {
      const date = new Date();
      date.setMinutes(this.startTime?.split(":")[1] as unknown as number);
      date.setHours(this.startTime?.split(":")[0] as unknown as number);
      return date;
    }
    return undefined;
  }

  public set endTimeDate(endTime: Date) {
    this.endTime = endTime.getHours + ":" + endTime.getMinutes;
  }

  public get endTimeDate(): Date {
    if (this.endTime) {
      const date = new Date();
      date.setMinutes(this.endTime?.split(":")[1] as unknown as number);
      date.setHours(this.endTime?.split(":")[0] as unknown as number);
      return date;
    }
    return undefined;
  }
}
