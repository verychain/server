import fs from "fs";
import path from "path";
import { specs } from "../common/config/swagger";

const docsDir = path.join(__dirname, "../docs");
const swaggerPath = path.join(docsDir, "swagger.json");

// docs 디렉토리 생성
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true });
}

// swagger.json 파일 생성
fs.writeFileSync(swaggerPath, JSON.stringify(specs, null, 2));

console.log("✅ Swagger JSON 파일이 생성되었습니다:", swaggerPath);
console.log("�� GitHub Pages에서 확인할 수 있습니다!");
