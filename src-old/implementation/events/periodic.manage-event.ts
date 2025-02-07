import {ManageEvent} from 'src-old/domain/events/manage.event';
import { Period } from 'src-old/domain/models/period';

export class PeriodicManageEvent<T extends Period> extends ManageEvent<T> {}