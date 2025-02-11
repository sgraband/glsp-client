/********************************************************************************
 * Copyright (c) 2020-2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/
import { ContainerModule } from 'inversify';
import {
    CenterCommand,
    ClosePopupActionHandler,
    configureActionHandler,
    configureCommand,
    FitToScreenCommand,
    HoverFeedbackCommand,
    HoverKeyListener,
    HoverState,
    MoveCommand,
    PopupHoverMouseListener,
    SetPopupModelCommand,
    SetViewportCommand,
    TYPES
} from 'sprotty';
import { PopupPositionUpdater } from 'sprotty/lib/features/hover/popup-position-updater';
import { FocusStateChangedAction } from '../../base/actions/focus-change-action';
import { GlspHoverMouseListener } from './hover';

const glspHoverModule = new ContainerModule((bind, _unbind, isBound) => {
    bind(TYPES.PopupVNodePostprocessor).to(PopupPositionUpdater).inSingletonScope();
    bind(TYPES.MouseListener).to(GlspHoverMouseListener);
    bind(TYPES.PopupMouseListener).to(PopupHoverMouseListener);
    bind(TYPES.KeyListener).to(HoverKeyListener);
    bind<HoverState>(TYPES.HoverState).toConstantValue({
        mouseOverTimer: undefined,
        mouseOutTimer: undefined,
        popupOpen: false,
        previousPopupElement: undefined
    });
    bind(ClosePopupActionHandler).toSelf().inSingletonScope();

    const context = { bind, isBound };
    configureCommand(context, HoverFeedbackCommand);
    configureCommand(context, SetPopupModelCommand);
    configureActionHandler(context, SetPopupModelCommand.KIND, ClosePopupActionHandler);
    configureActionHandler(context, FitToScreenCommand.KIND, ClosePopupActionHandler);
    configureActionHandler(context, CenterCommand.KIND, ClosePopupActionHandler);
    configureActionHandler(context, SetViewportCommand.KIND, ClosePopupActionHandler);
    configureActionHandler(context, MoveCommand.KIND, ClosePopupActionHandler);
    configureActionHandler(context, FocusStateChangedAction.KIND, ClosePopupActionHandler);
});

export default glspHoverModule;
