/********************************************************************************
 * Copyright (c) 2019-2021 EclipseSource and others.
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
import { ContainerModule, inject, injectable, multiInject, optional } from 'inversify';
import { configureCommand, configureLayout, ILogger, LayoutRegistration, LayoutRegistry, TYPES } from 'sprotty';
import { FreeFormLayouter } from './freeform-layout';
import { AlignElementsCommand, ResizeElementsCommand } from './layout-commands';
import { VBoxLayouterExt } from './vbox-layout';

const layoutCommandsModule = new ContainerModule((bind, _unbind, isBound, rebind) => {
    configureCommand({ bind, isBound }, ResizeElementsCommand);
    configureCommand({ bind, isBound }, AlignElementsCommand);

    configureLayout({ bind, isBound }, VBoxLayouterExt.KIND, VBoxLayouterExt);
    configureLayout({ bind, isBound }, FreeFormLayouter.KIND, FreeFormLayouter);

    bind(OverridableLayoutRegistry).toSelf().inSingletonScope();
    rebind(TYPES.LayoutRegistry).toService(OverridableLayoutRegistry);
});

export default layoutCommandsModule;

@injectable()
export class OverridableLayoutRegistry extends LayoutRegistry {
    // ensure logger is already used in constructor as otherwise not usable
    constructor(
        @multiInject(TYPES.LayoutRegistration) @optional() layouts: LayoutRegistration[] = [],
        @inject(TYPES.ILogger) logger: ILogger
    ) {
        super();
        layouts.forEach(layout => {
            if (this.hasKey(layout.layoutKind)) {
                logger.warn('Layout kind is already defined and will be overridden: ', layout.layoutKind);
                this.deregister(layout.layoutKind);
            }
            // allow overriding an existing layout kind
            this.register(layout.layoutKind, layout.factory());
        });
    }
}
