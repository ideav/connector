from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from app.models import QueryRequest, QueryResult, ExportRequest
from app.db_manager import db_manager
import io

router = APIRouter()

@router.post("/execute", response_model=QueryResult)
async def execute_query(request: QueryRequest):
    try:
        result = db_manager.execute_query(
            request.connection_id,
            request.query,
            request.page,
            request.page_size
        )
        return QueryResult(**result)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/export")
async def export_query(request: ExportRequest):
    try:
        result = db_manager.execute_query(
            request.connection_id,
            request.query,
            page=1,
            page_size=1000000
        )

        output = io.StringIO()

        output.write('\t'.join(result['columns']) + '\n')

        for row in result['rows']:
            row_str = '\t'.join([str(val) if val is not None else '' for val in row])
            output.write(row_str + '\n')

        output.seek(0)

        return StreamingResponse(
            io.BytesIO(output.getvalue().encode('utf-8')),
            media_type="text/tab-separated-values",
            headers={
                "Content-Disposition": "attachment; filename=export.tsv"
            }
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
