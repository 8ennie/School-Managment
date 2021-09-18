export class PublicTransport<T = Date> {
  public showPublicTransport: boolean = false;

  public startTime: T;

  public endTime: T;
}


export interface CurrentlyShowing {
  total: number;
  currentlyShowing: number[];
}

export interface TransportCpmponentConfiguration {
  total: number;
  showOnPage: number;
}