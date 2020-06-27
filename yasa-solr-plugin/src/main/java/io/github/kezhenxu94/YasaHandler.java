/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package io.github.kezhenxu94;

import java.io.IOException;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.apache.commons.io.IOUtils;
import org.apache.http.entity.ContentType;
import org.apache.solr.api.Command;
import org.apache.solr.api.EndPoint;
import org.apache.solr.client.solrj.SolrRequest.METHOD;
import org.apache.solr.common.params.CommonParams;
import org.apache.solr.common.params.ModifiableSolrParams;
import org.apache.solr.core.CoreContainer;
import org.apache.solr.core.SolrCore;
import org.apache.solr.handler.ReplicationHandler;
import org.apache.solr.request.SolrQueryRequest;
import org.apache.solr.response.SolrQueryResponse;
import org.apache.solr.security.PermissionNameProvider;

import static io.github.kezhenxu94.YasaHandler.PLUGIN_PATH;

@EndPoint(
  method = METHOD.GET,
  path = PLUGIN_PATH + "/*",
  permission = PermissionNameProvider.Name.CONFIG_READ_PERM
)
@RequiredArgsConstructor
@SuppressWarnings("unused")
public class YasaHandler {
  public static final String PLUGIN_PATH = "/plugin/yasa";

  private final CoreContainer coreContainer;

  @Command
  public void call(SolrQueryRequest req, SolrQueryResponse rsp) throws IOException {
    final String path = req.getHttpSolrCall().getPath();

    String filepath = path.substring(path.indexOf(PLUGIN_PATH) + PLUGIN_PATH.length());
    if ("".equalsIgnoreCase(filepath) || "/".equalsIgnoreCase(filepath)) {
      filepath = "/index.html";
    }

    final ModifiableSolrParams newParams = new ModifiableSolrParams(req.getOriginalParams());
    newParams.set(CommonParams.WT, ReplicationHandler.FILE_STREAM);
    req.setParams(newParams);

    final String contentType = contentType(filepath);
    final byte[] data = IOUtils.toByteArray(getClass().getResourceAsStream(filepath));
    final SolrCore.RawWriter writer = new SolrCore.RawWriter() {

      @Override
      public void write(OutputStream os) throws IOException {
        os.write(data);
      }

      @Override
      public String getContentType() {
        return contentType;
      }
    };

    rsp.add(ReplicationHandler.FILE_STREAM, writer);
  }

  private String contentType(final String filepath) {
    final Map<String, String> types = new HashMap<>();
    types.put("jpg", ContentType.IMAGE_JPEG.getMimeType());
    types.put("jpeg", ContentType.IMAGE_JPEG.getMimeType());
    types.put("png", ContentType.IMAGE_PNG.getMimeType());
    types.put("gif", ContentType.IMAGE_GIF.getMimeType());
    types.put("svg", ContentType.IMAGE_SVG.getMimeType());
    types.put("htm", ContentType.TEXT_HTML.getMimeType());
    types.put("html", ContentType.TEXT_HTML.getMimeType());
    types.put("json", ContentType.APPLICATION_JSON.getMimeType());
    types.put("xml", ContentType.APPLICATION_XML.getMimeType());
    types.put("js", "text/javascript");
    types.put("css", "text/css");

    final String extension = filepath.split("\\.")[filepath.split("\\.").length - 1];
    return types.getOrDefault(extension, "text/plain");
  }
}
