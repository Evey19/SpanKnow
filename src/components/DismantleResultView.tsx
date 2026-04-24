import { useState } from "react";
import { useContentDismantleMutation } from "@/features/contents/useContentDismantleMutation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles, AlertCircle, Layers } from "lucide-react";

interface DismantleResultViewProps {
  contentId: string;
  textContent?: string;
  isDismantled?: boolean;
}

export function DismantleResultView({ textContent, isDismantled }: DismantleResultViewProps) {
  const [hasDismantled, setHasDismantled] = useState(false);
  const { mutate, data, isPending, isError, error } = useContentDismantleMutation();

  const handleDismantle = () => {
    if (!textContent) return;
    setHasDismantled(true);
    mutate({ text: textContent });
  };

  if (!hasDismantled) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-slate-500 border-t border-slate-100 mt-8 pt-8">
        <Sparkles className={`w-8 h-8 mb-4 ${isDismantled ? "text-green-500" : "text-indigo-400"}`} />
        <p className="mb-4">
          {isDismantled ? "这篇内容已进行过知识拆解" : "这篇内容还没有进行知识拆解"}
        </p>
        <button
          onClick={handleDismantle}
          disabled={!textContent}
          className={`px-6 py-2 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
            isDismantled ? "bg-green-600 hover:bg-green-700" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          {isDismantled ? "查看拆解结果" : "AI 智能拆解"}
        </button>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="flex items-center justify-center p-8 text-slate-500">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        正在拆解内容...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-start gap-3 mt-8">
        <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="font-medium">无法加载拆解结果</h4>
          <p className="text-sm mt-1">{error?.message || "未知错误"}</p>
          <button 
            onClick={handleDismantle}
            className="mt-3 px-4 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm transition-colors"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  if (!data?.data) return null;

  const result = data.data;

  return (
    <div className="space-y-6 mt-8 border-t pt-8 border-slate-100">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-500" />
          AI 知识拆解
        </h3>
      </div>

      {result.knowledge_card_list && result.knowledge_card_list.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-400" />
            知识卡片
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.knowledge_card_list.map((card) => (
              <Card key={card.cardId} className="hover:shadow-md transition-all hover:border-indigo-200">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base text-slate-800 flex items-center justify-between">
                    <span className="font-semibold text-indigo-700">{card.question}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <p className="text-sm text-slate-600 mb-2">{card.content}</p>
                  
                  {card.summary && (
                    <div className="mt-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <span className="font-medium text-slate-500 block mb-1">总结：</span>
                      {card.summary}
                    </div>
                  )}

                  {card.analogy && (
                    <div className="mt-2 text-sm text-slate-600 bg-blue-50/50 p-3 rounded-lg border border-blue-50">
                      <span className="font-medium text-blue-500 block mb-1">类比：</span>
                      {card.analogy}
                    </div>
                  )}

                  {card.mnemonic && (
                    <div className="mt-2 text-sm text-slate-600 bg-green-50/50 p-3 rounded-lg border border-green-50">
                      <span className="font-medium text-green-500 block mb-1">记忆口诀：</span>
                      {card.mnemonic}
                    </div>
                  )}

                  {card.keywords && card.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {card.keywords.map((kw, i) => (
                        <span key={i} className="px-2 py-0.5 text-[10px] bg-indigo-50 text-indigo-600 rounded">
                          {kw}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {result.confusable_group_list && result.confusable_group_list.length > 0 && (
        <div className="space-y-3 mt-6">
          <h4 className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-orange-400" />
            易混淆知识点
          </h4>
          <div className="space-y-3">
            {result.confusable_group_list.map((group, i) => (
              <div key={i} className="p-4 bg-orange-50/50 border border-orange-100 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-semibold text-orange-800">{group.nameA}</span>
                  <span className="text-orange-400 text-xs">VS</span>
                  <span className="font-semibold text-orange-800">{group.nameB}</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div className="text-sm text-slate-600">
                    <span className="font-medium text-slate-700">{group.nameA}：</span>
                    {group.descA}
                  </div>
                  <div className="text-sm text-slate-600">
                    <span className="font-medium text-slate-700">{group.nameB}：</span>
                    {group.descB}
                  </div>
                </div>

                {group.diffPoints && group.diffPoints.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-orange-100/50">
                    <span className="text-xs font-medium text-orange-800/70 block mb-1.5">核心差异：</span>
                    <ul className="list-disc list-inside text-sm text-slate-600 ml-1 space-y-1">
                      {group.diffPoints.map((point, idx) => (
                        <li key={idx}>{point}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
