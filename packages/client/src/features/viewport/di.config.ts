/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
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
import {
    CenterCommand,
    CenterKeyboardListener,
    configureCommand,
    FitToScreenCommand,
    GetViewportCommand,
    SetViewportCommand,
    TYPES,
    ZoomMouseListener,
} from "sprotty";
import { ContainerModule } from "inversify";

import { GLSPScrollMouseListener } from "./glsp-scroll-mouse-listener";

const glspViewportModule = new ContainerModule((bind, _unbind, isBound) => {
    configureCommand({ bind, isBound }, CenterCommand);
    configureCommand({ bind, isBound }, FitToScreenCommand);
    configureCommand({ bind, isBound }, GetViewportCommand);
    configureCommand({ bind, isBound }, SetViewportCommand);
    bind(TYPES.KeyListener).to(CenterKeyboardListener);
    bind(TYPES.MouseListener).to(ZoomMouseListener);
    bind(TYPES.MouseListener).to(GLSPScrollMouseListener);
});

export default glspViewportModule;