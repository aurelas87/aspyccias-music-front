export const adminBasePath = '/admin'

export enum DirectionEnum { Up = 'up', Down = 'down'}

export interface TableHeader {
  name: string,
  property: string
}

export type TableHeaders = TableHeader[]
