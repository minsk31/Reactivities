import { Profile } from "./profile"

export interface IActivity {
  id: string
  title: string
  date: Date | null
  description: string
  category: string
  city: string
  venue: string
  isCancelled: boolean
  hostUserName: string
  isGoing?: boolean
  isHost: boolean
  host?: Profile
  attendees?: Profile[]
}

export class Activity implements IActivity {
  id: string
  title: string
  date: Date | null
  description: string
  category: string
  city: string
  venue: string
  isCancelled: boolean = false
  hostUserName: string  = ''
  isGoing: boolean = false
  isHost: boolean = false
  host?: Profile | undefined
  attendees?: Profile[]

  constructor(formValues: ActivityFormValues) {
    this.id = formValues.id!
    this.category = formValues.category,
    this.city = formValues.city,
    this.date = formValues.date,
    this.description = formValues.description,
    this.title = formValues.title,
    this.venue = formValues.venue
  }

}

export class ActivityFormValues {
  id?: string = undefined
  title: string = ''
  date: Date | null = null
  description: string = ''
  category: string = ''
  city: string = ''
  venue: string = ''

  constructor(activityFormVaules?: ActivityFormValues) {
    if (activityFormVaules) {
        this.id = activityFormVaules.id
        this.category = activityFormVaules.category,
        this.city = activityFormVaules.city,
        this.date = activityFormVaules.date,
        this.description = activityFormVaules.description,
        this.title = activityFormVaules.title,
        this.venue = activityFormVaules.venue
    }
  }
}