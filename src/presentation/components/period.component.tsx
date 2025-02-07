import {PeriodUiModel} from 'src/presentation/models/period.ui-model';
import {ModifierKey} from 'src/presentation/models/modifier-key';
import React, {ReactElement} from 'react';
import {Period} from 'src/domain/models/period.model';

interface PeriodViewProperties {
    model?: PeriodUiModel,
    onClick?: (key: ModifierKey, model: Period) => void;
}

export const PeriodComponent = ({model, onClick}: PeriodViewProperties): ReactElement => {
    if (!model) {
        return <></>;
    }

    const modifierKey = (event: React.MouseEvent): ModifierKey => {
        if (event.metaKey) {
            return ModifierKey.Meta;
        } else if (event.altKey) {
            return ModifierKey.Alt;
        } else if (event.shiftKey) {
            return ModifierKey.Shift;
        }

        return ModifierKey.None
    };

    return (
        <div
            onClick={(e: React.MouseEvent) => {
                onClick?.call(modifierKey(e), model?.period);
                e.preventDefault();
            }}>{model.period.name}</div>
    );
};