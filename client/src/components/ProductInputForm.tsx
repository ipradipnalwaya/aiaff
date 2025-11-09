import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contentGenerationSchema, type ContentGenerationInput } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, X, Sparkles, RotateCcw } from "lucide-react";

interface ProductInputFormProps {
  onGenerate: (data: ContentGenerationInput) => void;
  isGenerating: boolean;
}

export function ProductInputForm({ onGenerate, isGenerating }: ProductInputFormProps) {
  const [affiliateUrls, setAffiliateUrls] = useState<string[]>([""]);
  const [resourceUrls, setResourceUrls] = useState<string[]>([""]);
  const [resourceType, setResourceType] = useState<"text" | "url">("text");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    trigger,
  } = useForm<ContentGenerationInput>({
    resolver: zodResolver(contentGenerationSchema),
    defaultValues: {
      productName: "",
      productDescription: "",
      affiliateUrls: [""],
      resourceType: "text",
      resourceText: "",
      resourceUrls: [""],
      tone: "professional",
      targetAudience: "",
      wordCount: "1000",
    },
  });

  const addAffiliateUrl = () => {
    setAffiliateUrls([...affiliateUrls, ""]);
  };

  const removeAffiliateUrl = (index: number) => {
    const newUrls = affiliateUrls.filter((_, i) => i !== index);
    setAffiliateUrls(newUrls.length === 0 ? [""] : newUrls);
    setValue("affiliateUrls", newUrls.length === 0 ? [""] : newUrls);
  };

  const updateAffiliateUrl = (index: number, value: string) => {
    const newUrls = [...affiliateUrls];
    newUrls[index] = value;
    setAffiliateUrls(newUrls);
    setValue("affiliateUrls", newUrls, { shouldValidate: true });
  };

  const addResourceUrl = () => {
    setResourceUrls([...resourceUrls, ""]);
  };

  const removeResourceUrl = (index: number) => {
    const newUrls = resourceUrls.filter((_, i) => i !== index);
    setResourceUrls(newUrls.length === 0 ? [""] : newUrls);
    setValue("resourceUrls", newUrls.length === 0 ? [""] : newUrls);
  };

  const updateResourceUrl = (index: number, value: string) => {
    const newUrls = [...resourceUrls];
    newUrls[index] = value;
    setResourceUrls(newUrls);
    setValue("resourceUrls", newUrls, { shouldValidate: true });
  };

  const onSubmit = (data: ContentGenerationInput) => {
    const validAffiliateUrls = affiliateUrls.filter(url => url.trim() !== "");
    const validResourceUrls = resourceUrls.filter(url => url.trim() !== "");
    onGenerate({ 
      ...data, 
      affiliateUrls: validAffiliateUrls,
      resourceUrls: resourceType === "url" ? validResourceUrls : undefined,
      resourceText: resourceType === "text" ? data.resourceText : undefined,
      resourceType 
    });
  };

  const handleReset = () => {
    reset();
    setAffiliateUrls([""]);
    setResourceUrls([""]);
    setResourceType("text");
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="productName">Product Name *</Label>
          <Input
            id="productName"
            placeholder="e.g., Premium Wireless Headphones"
            {...register("productName")}
            data-testid="input-product-name"
          />
          {errors.productName && (
            <p className="text-sm text-destructive">{errors.productName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="productDescription">Product Description *</Label>
          <Textarea
            id="productDescription"
            placeholder="Describe the product, its features, and benefits..."
            className="min-h-32 resize-none"
            {...register("productDescription")}
            data-testid="input-product-description"
          />
          {errors.productDescription && (
            <p className="text-sm text-destructive">{errors.productDescription.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Affiliate URLs *</Label>
          <div className="space-y-2">
            {affiliateUrls.map((url, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="https://example.com/affiliate-link"
                  value={url}
                  onChange={(e) => updateAffiliateUrl(index, e.target.value)}
                  data-testid={`input-affiliate-url-${index}`}
                />
                {affiliateUrls.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeAffiliateUrl(index)}
                    data-testid={`button-remove-url-${index}`}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addAffiliateUrl}
              className="w-full"
              data-testid="button-add-url"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add URL
            </Button>
          </div>
          {errors.affiliateUrls && (
            <p className="text-sm text-destructive">{errors.affiliateUrls.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Resource Input *</Label>
          <Tabs value={resourceType} onValueChange={(v) => {
            const newType = v as "text" | "url";
            setResourceType(newType);
            setValue("resourceType", newType, { shouldValidate: false });
            setTimeout(() => trigger(["resourceText", "resourceUrls"]), 0);
          }}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="text" data-testid="tab-text">Paste Text</TabsTrigger>
              <TabsTrigger value="url" data-testid="tab-url">Enter URLs</TabsTrigger>
            </TabsList>
            <TabsContent value="text" className="mt-4">
              <Textarea
                placeholder="Paste existing content, reviews, or product information here..."
                className="min-h-48 resize-none"
                {...register("resourceText")}
                data-testid="input-resource-text"
              />
            </TabsContent>
            <TabsContent value="url" className="mt-4 space-y-2">
              {resourceUrls.map((url, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="https://example.com/product-review"
                    value={url}
                    onChange={(e) => updateResourceUrl(index, e.target.value)}
                    data-testid={`input-resource-url-${index}`}
                  />
                  {resourceUrls.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeResourceUrl(index)}
                      data-testid={`button-remove-resource-url-${index}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addResourceUrl}
                className="w-full"
                data-testid="button-add-resource-url"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Resource URL
              </Button>
            </TabsContent>
          </Tabs>
          {errors.resourceText && resourceType === "text" && (
            <p className="text-sm text-destructive">{errors.resourceText.message}</p>
          )}
          {errors.resourceUrls && resourceType === "url" && (
            <p className="text-sm text-destructive">{errors.resourceUrls.message}</p>
          )}
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="tone">Tone</Label>
            <Select defaultValue="professional" onValueChange={(value) => setValue("tone", value as any)}>
              <SelectTrigger id="tone" data-testid="select-tone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                <SelectItem value="informative">Informative</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="wordCount">Word Count</Label>
            <Select defaultValue="1000" onValueChange={(value) => setValue("wordCount", value as any)}>
              <SelectTrigger id="wordCount" data-testid="select-word-count">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="800">800 words</SelectItem>
                <SelectItem value="1000">1000 words</SelectItem>
                <SelectItem value="1500">1500 words</SelectItem>
                <SelectItem value="2000">2000 words</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="targetAudience">Target Audience (Optional)</Label>
          <Input
            id="targetAudience"
            placeholder="e.g., Tech enthusiasts, gamers"
            {...register("targetAudience")}
            data-testid="input-target-audience"
          />
        </div>

        <div className="flex gap-4 justify-end pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={isGenerating}
            data-testid="button-clear-form"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Clear Form
          </Button>
          <Button
            type="submit"
            disabled={isGenerating}
            className="px-8"
            data-testid="button-generate"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            {isGenerating ? "Generating..." : "Generate Content"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
