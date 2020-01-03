/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { BroadcasterLambdaFactory } from "@microsoft/fluid-server-lambdas";
import * as services from "@microsoft/fluid-server-services";
import { IPartitionLambdaFactory } from "@microsoft/fluid-server-services-core";
import { Provider } from "nconf";

export async function create(config: Provider): Promise<IPartitionLambdaFactory> {
    const redisConfig = config.get("redis");
    const redisOptions: any = { password: redisConfig.pass };
    if (redisConfig.tls) {
        redisOptions.tls = {
            serverName: redisConfig.host,
        };
    }

    const publisher = new services.SocketIoRedisPublisher(redisConfig.port, redisConfig.host, redisOptions);

    return new BroadcasterLambdaFactory(publisher);
}