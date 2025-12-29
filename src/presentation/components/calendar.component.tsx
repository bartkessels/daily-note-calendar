import React, { ReactElement } from "react";
import { ObsidianIcon } from "src/presentation/obsidian/icons";
import { useCalendarViewModel } from "src/presentation/context/view-model.context";
import { NotesComponent } from "src/presentation/components/notes.component";
import { MonthlyNoteComponent } from "src/presentation/components/month.component";
import { QuarterlyNoteComponent } from "./quarter.component";
import { YearlyNoteComponent } from "src/presentation/components/year.component";
import { WeeklyNoteComponent } from "src/presentation/components/week.component";
import { Period } from "src/domain/models/period.model";
import { Calendar } from "src/domain/models/calendar.model";
import "src/extensions/extensions";

interface CalendarComponentProperties {
  initialCalendar?: Calendar | null;
}

export const CalendarComponent = (
  props: CalendarComponentProperties
): ReactElement => {
  const viewModel = useCalendarViewModel();
  const [calendar, setCalendar] = React.useState<Calendar | null>(
    props.initialCalendar ?? null
  );
  const [selectedPeriod, setSelectedPeriod] = React.useState<Period | null>(
    null
  );
  const initializedRef = React.useRef(false);

  React.useEffect(() => {
    const currentCalendar = viewModel?.getCurrentWeek() ?? null;
    setCalendar(currentCalendar);

    if (!initializedRef.current && currentCalendar?.today) {
      setSelectedPeriod(currentCalendar.today);
      setCalendar(viewModel?.getWeekForPeriod(currentCalendar.today) ?? null);
      initializedRef.current = true;
    }
  }, [viewModel, setCalendar, setSelectedPeriod]);

  const handleDaySelected = React.useCallback(
    (period: Period) => {
      setSelectedPeriod(period);
      setCalendar(viewModel?.getWeekForPeriod(period) ?? null);
    },
    [viewModel]
  );

  const loadNextWeek = React.useCallback(() => {
    if (!calendar) return;
    setCalendar(viewModel?.getNextWeek(calendar) ?? null);
  }, [calendar, viewModel]);

  const loadPreviousWeek = React.useCallback(() => {
    if (!calendar) return;
    setCalendar(viewModel?.getPreviousWeek(calendar) ?? null);
  }, [calendar, viewModel]);

  const loadCurrentWeek = React.useCallback(() => {
    const currentCalendar = viewModel?.getCurrentWeek() ?? null;
    if (!currentCalendar?.today) {
      return;
    }
    setSelectedPeriod(currentCalendar.today);
    setCalendar(viewModel?.getWeekForPeriod(currentCalendar.today) ?? null);
  }, [viewModel]);

  const loadNextMonth = React.useCallback(() => {
    if (!calendar) return;
    setCalendar(viewModel?.getNextMonth(calendar) ?? null);
  }, [calendar, viewModel]);

  const loadPreviousMonth = React.useCallback(() => {
    if (!calendar) return;
    setCalendar(viewModel?.getPreviousMonth(calendar) ?? null);
  }, [calendar, viewModel]);

  React.useEffect(() => {
    viewModel?.initializeCallbacks(
      handleDaySelected,
      loadNextWeek,
      loadPreviousWeek,
      loadCurrentWeek,
      loadNextMonth,
      loadPreviousMonth
    );
  }, [
    viewModel,
    handleDaySelected,
    loadNextWeek,
    loadPreviousWeek,
    loadCurrentWeek,
    loadNextMonth,
    loadPreviousMonth,
  ]);

  if (!calendar) {
    return <></>;
  }

  return (
    <div className="dnc">
      <div className="header">
        <span className="title">
          <h1>
            <MonthlyNoteComponent month={calendar.month} />
          </h1>
          <h1>
            <YearlyNoteComponent year={calendar.year} />
          </h1>
        </span>

        <div className="buttons">
          <ObsidianIcon
            icon="chevrons-left"
            size={18}
            onClick={() => loadPreviousMonth()}
          />
          <ObsidianIcon
            icon="chevron-left"
            size={18}
            onClick={() => loadPreviousWeek()}
          />
          <ObsidianIcon
            icon="calendar-with-checkmark"
            size={18}
            onClick={() => loadCurrentWeek()}
          />
          <ObsidianIcon
            icon="chevron-right"
            size={18}
            onClick={() => loadNextWeek()}
          />
          <ObsidianIcon
            icon="chevrons-right"
            size={18}
            onClick={() => loadNextMonth()}
          />
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th className="quarter">
              <QuarterlyNoteComponent quarter={calendar.quarter} />
            </th>

            {calendar.weekDays.map((day, index) => (
              <th key={index}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {calendar.weeks.map((week, weekIndex) => (
            <WeeklyNoteComponent
              key={weekIndex}
              week={week}
              days={week.days}
              selectedPeriod={selectedPeriod}
              today={calendar.today}
              currentMonth={calendar.month}
              onSelect={handleDaySelected}
            />
          ))}
        </tbody>
      </table>

      <NotesComponent period={selectedPeriod} />
    </div>
  );
};
