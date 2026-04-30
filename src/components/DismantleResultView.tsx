import { useState, useMemo } from "react";
import { useContentDismantleMutation } from "@/features/contents/useContentDismantleMutation";
import { useAddReviewCardsMutation } from "@/features/review/useAddReviewCardsMutation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles, AlertCircle, Layers, Plus, CheckSquare, Square, Check, RotateCcw } from "lucide-react";

interface DismantleResultViewProps {
  contentId: string;
  textContent?: string;
  isDismantled?: boolean;
}

export function DismantleResultView({ contentId, textContent, isDismantled }: DismantleResultViewProps) {
  const [hasDismantled, setHasDismantled] = useState(false);
  const { mutate, data, isPending, isError, error } = useContentDismantleMutation();
  const { mutate: addReviewCards, isPending: isAddingReview } = useAddReviewCardsMutation();

  const handleDismantle = () => {
    if (!textContent) return;
    setHasDismantled(true);
    mutate({ contentId, text: textContent });
  };

  const handleForceDismantle = () => {
    if (!textContent) return;
    setHasDismantled(true);
    setSelectedIds(new Set());
    setAddedCardIds(new Set());
    mutate({ contentId, text: textContent, force_refresh: true });
  };

  const allCards = useMemo(() => {
    if (!data?.data) return [];
    const result = data.data;
    const cards: { id: string; card_id: string; knowledge_content: string; is_in_user_cards?: boolean }[] = [];
    
    result.knowledge_card_list?.forEach((card) => {
      cards.push({
        id: String(card.cardId),
        card_id: String(card.cardId),
        knowledge_content: `${card.question}\n\n${card.content}${card.summary ? `\n\n总结：${card.summary}` : ''}${card.analogy ? `\n\n类比：${card.analogy}` : ''}${card.mnemonic ? `\n\n记忆口诀：${card.mnemonic}` : ''}`,
        is_in_user_cards: card.is_in_user_cards
      });
    });

    result.confusable_group_list?.forEach((group, i) => {
      const cardId = `confusable_${i}`;
      cards.push({
        id: cardId,
        card_id: cardId,
        knowledge_content: `辨析：${group.nameA} vs ${group.nameB}\n\n${group.nameA}：${group.descA}\n\n${group.nameB}：${group.descB}${group.diffPoints && group.diffPoints.length > 0 ? `\n\n核心差异：\n${group.diffPoints.map(p => `• ${p}`).join('\n')}` : ''}`
      });
    });

    return cards;
  }, [data?.data]);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [addedCardIds, setAddedCardIds] = useState<Set<string>>(new Set());

  const handleToggleSelectAll = () => {
    const selectableCards = allCards.filter(c => !c.is_in_user_cards && !addedCardIds.has(c.id));
    if (selectedIds.size === selectableCards.length && selectableCards.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(selectableCards.map(c => c.id)));
    }
  };

  const handleToggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const handleBatchAddReview = () => {
    if (selectedIds.size === 0) return;
    const cardsToAdd = allCards
      .filter(c => selectedIds.has(c.id))
      .map(c => ({
        card_id: c.card_id,
        knowledge_content: c.knowledge_content
      }));
    
    addReviewCards({
      content_id: contentId,
      cards: cardsToAdd
    }, {
      onSuccess: () => {
        setAddedCardIds(prev => {
          const next = new Set(prev);
          selectedIds.forEach(id => next.add(id));
          return next;
        });
        setSelectedIds(new Set());
      }
    });
  };

  const handleAddReview = (card: { cardId: string | number; question: string; content: string; summary?: string; analogy?: string; mnemonic?: string }) => {
    const isConfusable = typeof card.cardId === 'string' && card.cardId.startsWith('confusable_');
    const cardIdStr = String(card.cardId);
    addReviewCards({
      content_id: contentId,
      cards: [
        {
          card_id: cardIdStr,
          knowledge_content: isConfusable 
            ? `${card.question}\n\n${card.content}${card.summary ? `\n\n${card.summary}` : ''}`
            : `${card.question}\n\n${card.content}${card.summary ? `\n\n总结：${card.summary}` : ''}${card.analogy ? `\n\n类比：${card.analogy}` : ''}${card.mnemonic ? `\n\n记忆口诀：${card.mnemonic}` : ''}`
        }
      ]
    }, {
      onSuccess: () => {
        setAddedCardIds(prev => new Set(prev).add(cardIdStr));
        setSelectedIds(prev => {
          const next = new Set(prev);
          next.delete(cardIdStr);
          return next;
        });
      }
    });
  };

  if (!hasDismantled) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-muted-foreground border-t border-border mt-8 pt-8">
        <Sparkles className={`w-8 h-8 mb-4 ${isDismantled ? "text-[color:var(--chart-3)]" : "text-primary"}`} />
        <p className="mb-4">
          {isDismantled ? "这篇内容已进行过知识拆解" : "这篇内容还没有进行知识拆解"}
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDismantle}
            disabled={!textContent || isPending}
            className={`px-6 py-2 text-primary-foreground rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
              isDismantled ? "bg-[color:var(--chart-3)] hover:opacity-90" : "bg-primary hover:bg-primary/90"
            }`}
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {isPending ? "拆解中..." : (isDismantled ? "查看拆解结果" : "AI 智能拆解")}
          </button>
          {isDismantled && (
            <button
              onClick={handleForceDismantle}
              disabled={!textContent || isPending}
              className="px-6 py-2 bg-card border border-border text-foreground rounded-lg hover:bg-muted transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
              重新拆解
            </button>
          )}
        </div>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="flex items-center justify-center p-8 text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        正在拆解内容...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 bg-destructive/10 text-destructive rounded-xl flex items-start gap-3 mt-8">
        <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="font-medium">无法加载拆解结果</h4>
          <p className="text-sm mt-1">{error?.message || "未知错误"}</p>
          <button 
            onClick={handleDismantle}
            className="mt-3 px-4 py-1.5 bg-destructive/15 hover:bg-destructive/20 text-destructive rounded-lg text-sm transition-colors"
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
    <div className="space-y-6 mt-8 border-t pt-8 border-border">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          AI 知识拆解
        </h3>
        <div className="flex items-center gap-3">
          <button
            onClick={handleForceDismantle}
            disabled={!textContent || isPending}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border text-foreground text-sm rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
            重新拆解
          </button>
          {allCards.length > 0 && (
            <>
              <button
                onClick={handleToggleSelectAll}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {selectedIds.size > 0 && selectedIds.size === allCards.filter(c => !c.is_in_user_cards && !addedCardIds.has(c.id)).length ? (
                  <CheckSquare className="w-4 h-4 text-primary" />
                ) : (
                  <Square className="w-4 h-4" />
                )}
                全选
              </button>
              <button
                onClick={handleBatchAddReview}
                disabled={selectedIds.size === 0 || isAddingReview}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAddingReview ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                批量加入复习 ({selectedIds.size})
              </button>
            </>
          )}
        </div>
      </div>

      {result.knowledge_card_list && result.knowledge_card_list.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <Layers className="w-4 h-4 text-muted-foreground" />
            知识卡片
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.knowledge_card_list.map((card) => {
              const isCardInUserCards = card.is_in_user_cards || addedCardIds.has(String(card.cardId));
              return (
              <Card key={card.cardId} className={`hover:shadow-md transition-all hover:border-ring/40 ${selectedIds.has(String(card.cardId)) ? 'border-ring/60 ring-1 ring-ring/20 bg-accent/10' : ''}`}>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base text-foreground flex items-center justify-between">
                    <span className="font-semibold">{card.question}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggleSelect(String(card.cardId))}
                        disabled={isCardInUserCards}
                        className={`p-1.5 transition-colors ${
                          isCardInUserCards 
                            ? "text-muted-foreground/40 cursor-not-allowed" 
                            : "text-muted-foreground hover:text-primary"
                        }`}
                        title={isCardInUserCards ? "已在复习库中" : "选择"}
                      >
                        {selectedIds.has(String(card.cardId)) || isCardInUserCards ? (
                          <CheckSquare className={`w-5 h-5 ${isCardInUserCards ? "text-muted-foreground/40" : "text-primary"}`} />
                        ) : (
                          <Square className="w-5 h-5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleAddReview(card)}
                        disabled={isAddingReview || isCardInUserCards}
                        className={`p-1.5 rounded-md transition-colors ${
                          isCardInUserCards 
                            ? "text-muted-foreground cursor-not-allowed bg-muted" 
                            : "text-primary hover:bg-accent disabled:opacity-50"
                        }`}
                        title={isCardInUserCards ? "已加入复习库" : "加入复习库"}
                      >
                        {isAddingReview ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : isCardInUserCards ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <p className="text-sm text-muted-foreground mb-2">{card.content}</p>
                  
                  {card.summary && (
                    <div className="mt-2 text-sm text-muted-foreground bg-muted p-3 rounded-lg border border-border">
                      <span className="font-medium text-foreground block mb-1">总结：</span>
                      {card.summary}
                    </div>
                  )}

                  {card.analogy && (
                    <div className="mt-2 text-sm text-muted-foreground bg-[color:var(--chart-1)]/10 p-3 rounded-lg border border-[color:var(--chart-1)]/15">
                      <span className="font-medium text-[color:var(--chart-1)] block mb-1">类比：</span>
                      {card.analogy}
                    </div>
                  )}

                  {card.mnemonic && (
                    <div className="mt-2 text-sm text-muted-foreground bg-[color:var(--chart-3)]/10 p-3 rounded-lg border border-[color:var(--chart-3)]/15">
                      <span className="font-medium text-[color:var(--chart-3)] block mb-1">记忆口诀：</span>
                      {card.mnemonic}
                    </div>
                  )}

                  {card.keywords && card.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {card.keywords.map((kw, i) => (
                        <span key={i} className="px-2 py-0.5 text-[10px] bg-accent text-accent-foreground rounded">
                          {kw}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )})}
          </div>
        </div>
      )}

      {result.confusable_group_list && result.confusable_group_list.length > 0 && (
        <div className="space-y-3 mt-6">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[color:var(--chart-4)]" />
            易混淆知识点
          </h4>
          <div className="space-y-3">
            {result.confusable_group_list.map((group, i) => {
              const cardId = `confusable_${i}`;
              const isCardInUserCards = addedCardIds.has(cardId);
              return (
              <div key={i} className={`p-4 border rounded-xl relative group transition-colors ${selectedIds.has(cardId) ? 'bg-[color:var(--chart-4)]/12 border-[color:var(--chart-4)]/30' : 'bg-[color:var(--chart-4)]/8 border-[color:var(--chart-4)]/18'}`}>
                <div className={`absolute right-4 top-4 transition-opacity flex items-center gap-1 ${selectedIds.has(cardId) || isCardInUserCards ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                  <button
                    onClick={() => handleToggleSelect(cardId)}
                    disabled={isCardInUserCards}
                    className={`p-1.5 transition-colors bg-card shadow-sm rounded-md ${
                      isCardInUserCards 
                        ? "text-muted-foreground/40 cursor-not-allowed" 
                        : "text-muted-foreground hover:text-[color:var(--chart-4)]"
                    }`}
                    title={isCardInUserCards ? "已在复习库中" : "选择"}
                  >
                    {selectedIds.has(cardId) || isCardInUserCards ? (
                      <CheckSquare className={`w-4 h-4 ${isCardInUserCards ? "text-muted-foreground/40" : "text-[color:var(--chart-4)]"}`} />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleAddReview({
                      cardId,
                      question: `辨析：${group.nameA} vs ${group.nameB}`,
                      content: `${group.nameA}：${group.descA}\n\n${group.nameB}：${group.descB}`,
                      summary: group.diffPoints && group.diffPoints.length > 0 
                        ? `核心差异：\n${group.diffPoints.map(p => `• ${p}`).join('\n')}` 
                        : undefined
                    })}
                    disabled={isAddingReview || isCardInUserCards}
                    className={`p-1.5 rounded-md transition-colors bg-card shadow-sm ${
                      isCardInUserCards 
                        ? "text-muted-foreground/40 cursor-not-allowed" 
                        : "text-[color:var(--chart-4)] hover:bg-[color:var(--chart-4)]/15 disabled:opacity-50"
                    }`}
                    title={isCardInUserCards ? "已加入复习库" : "加入复习库"}
                  >
                    {isAddingReview ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : isCardInUserCards ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <div className="flex items-center gap-2 mb-3 pr-8">
                  <span className="font-semibold text-foreground">{group.nameA}</span>
                  <span className="text-[color:var(--chart-4)] text-xs">VS</span>
                  <span className="font-semibold text-foreground">{group.nameB}</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{group.nameA}：</span>
                    {group.descA}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{group.nameB}：</span>
                    {group.descB}
                  </div>
                </div>

                {group.diffPoints && group.diffPoints.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-[color:var(--chart-4)]/15">
                    <span className="text-xs font-medium text-[color:var(--chart-4)]/80 block mb-1.5">核心差异：</span>
                    <ul className="list-disc list-inside text-sm text-muted-foreground ml-1 space-y-1">
                      {group.diffPoints.map((point, idx) => (
                        <li key={idx}>{point}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )})}
          </div>
        </div>
      )}
    </div>
  );
}
